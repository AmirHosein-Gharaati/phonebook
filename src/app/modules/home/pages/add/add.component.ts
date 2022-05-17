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
import { lastValueFrom, Observable, of } from 'rxjs';
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
import {
  CDCategories,
  ControlData,
} from 'src/app/shared/models/control-data.model';

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

  private async initForm() {
    this.contactForm = this.formBuilder.group({
      id: this.id,
      imageURL: new FormControl(null, Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      controlDatas: new FormArray([]),
    });

    (<FormControl>this.contactForm.get('firstName')).updateValueAndValidity();

    if (this.editMode) {
      let contact;
      let imageURL = '';
      let firstName = '';
      let lastName = '';
      const data = new FormArray([]);

      try {
        contact = await lastValueFrom(this.apiService.findContact(this.id));
        imageURL = contact.imageURL;
        firstName = contact.firstName;
        lastName = contact.lastName;

        contact.controlDatas.forEach((controlData) => {
          this.contactData.push(this.newData(controlData));
        });

      } catch (error) {
        this.router.navigate(['../'], { relativeTo: this.route });
      }

      this.contactForm.patchValue({
        imageURL: imageURL,
        firstName: firstName,
        lastName: lastName
      });
    }
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

  private newData(data: ControlData | null = null): FormGroup {
    const form: FormGroup = this.formBuilder.group({
      category: new FormControl(data?.category, Validators.required),
      text: new FormControl(data?.text),
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
      this.contactService.updateConact(this.contactForm.value as Contact);
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
