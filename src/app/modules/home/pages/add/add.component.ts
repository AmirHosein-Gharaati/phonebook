import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ContactService } from 'src/app/core/services/contact.service';
import { Contact } from 'src/app/shared/models/contact.model';
import { CDCategories } from 'src/app/shared/models/control-data.model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  id: number;
  contactForm: FormGroup;
  editMode: boolean = false;
  controlDataOptions = CDCategories;
  http: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = this.getComponentId(params);
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    let imageURL = '';
    let firstName = '';
    let lastName = '';
    let data = new FormArray([]);

    if (this.editMode) {
      let contact;
      try {
        contact = this.contactService.getContact(this.id);
      } catch (error) {
        this.router.navigate(['../'], { relativeTo: this.route });
        return;
      }

      imageURL = contact.imageURL;
      firstName = contact.firstName;
      lastName = contact.lastName;

      if (contact['controlDatas']) {
        contact.controlDatas.forEach((controlData) => {
          data.push(this.newData(controlData.category, controlData.text));
        });
      }
    }

    this.contactForm = this.formBuilder.group({
      id: this.id,
      imageURL: new FormControl(imageURL, [], this.imageValidator()),
      firstName: new FormControl(firstName, Validators.required),
      lastName: new FormControl(lastName, Validators.required),
      controlDatas: data,
    });
  }

  get contactData(): FormArray {
    return this.contactForm.get('controlDatas') as FormArray;
  }

  private newData(category: string = '', text: string = ''): FormGroup {
    const form = this.formBuilder.group({
      category: new FormControl(category, Validators.required),
      text: new FormControl(text),
    });

    const categoryControl: FormControl = form.get('category') as FormControl;
    const textControl: FormControl = form.get('text') as FormControl;

    categoryControl.valueChanges.subscribe((categoryType) => {
      if (
        categoryType == CDCategories.PHONE_NUMBER ||
        categoryType == CDCategories.HOME_NUMBER
      ) {
        textControl.setValidators(
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')
        );
      } else if (categoryType == CDCategories.EMAIL) {
        textControl.setValidators(Validators.email);
      }
    });

    return form;
  }

  private getComponentId(params: Params) {
    return +params['id'] ? +params['id'] : this.contactService.getLength() + 1;
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSumbit() {
    if (this.editMode) {
      this.contactService.updateConact(
        this.id,
        this.contactForm.value as Contact
      );
    } else {
      this.contactService.addContact(this.contactForm.value as Contact);
    }

    this.onCancel();
  }

  addCategory() {
    this.contactData.push(this.newData());
  }

  removeCategory(index: number) {
    this.contactData.removeAt(index);
  }

  imageValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const imageURL: string = control.value;

      return this.http.get(imageURL).pipe(
        debounceTime(500),
        map((data: any) => {
          if (!data.isValid) return { InValid: true };
          return null;
        })
      );
    };
  }
}
