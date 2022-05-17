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
import { Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api.service';
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
  contact: Contact;
  editMode: boolean = false;
  controlDataOptions = CDCategories;
  validImage: boolean;
  defaultProfileImageURL: string =
    'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = this.getComponentId(params);
      this.editMode = params['id'] != null;
    });

    this.initForm();
    this.validImage = this.editMode;
  }

  private initForm() {
    let imageURL = '';
    let firstName = '';
    let lastName = '';
    let data = new FormArray([]);

    if (this.editMode) {
      let contact: Contact;
      try {
        contact = this.contactService.getContact(this.id);

        imageURL = contact.imageURL;
        firstName = contact.firstName;
        lastName = contact.lastName;

        contact.controlDatas.forEach((controlData) => {
          data.push(this.newData(controlData.category, controlData.text));
        });
      } catch (error) {
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    }

    this.contactForm = this.formBuilder.group({
      id: this.id,
      imageURL: new FormControl(imageURL, Validators.required),
      firstName: new FormControl(firstName, Validators.required),
      lastName: new FormControl(lastName, Validators.required),
      controlDatas: data,
    });

    (<FormControl>this.contactForm.get('firstName')).updateValueAndValidity();
  }

  get contactData(): FormArray {
    return this.contactForm.get('controlDatas') as FormArray;
  }

  get imageurl(): string {
    return this.contactForm.get('imageURL')?.value;
  }

  set imageurl(url: string) {
    this.contactForm.patchValue({
      imageURL: url,
    });
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
      if (!this.imageurl) {
        this.imageurl = this.defaultProfileImageURL;
      }
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

      if (!control.value) return of(null);

      return control.valueChanges
        .pipe(
          map(() => (this.validImage = false)),
          debounceTime(500),

          distinctUntilChanged(),
          switchMap((value) =>
            this.contactService.fetchValidImageURL(imageURL)
          ),
          map((data: any) => {
            this.validImage = data.type.startsWith('image/');
            return this.validImage ? null : { invalidAsync: true };
          })
        )
        .pipe(
          catchError((err) => {
            this.validImage = false;
            return of({ invalidAsync: true });
          })
        );
    };
  }
}
