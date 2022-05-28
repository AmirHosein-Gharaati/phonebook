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
import { PersonService } from 'src/app/core/services/person.service';
import { IMAGE_URLS } from 'src/app/shared/image-urls.model';
import { Categories, Contact } from 'src/app/shared/models/contact.model';
import { Person } from 'src/app/shared/models/person.model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  id: number;
  personForm: FormGroup;
  person: Person;
  editMode: boolean = false;
  contactOptions = Categories;
  IMAGES = IMAGE_URLS;
  validImage: boolean;
  defaultProfileImageURL: string =
    'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = this.getComponentId(params);
      this.editMode = params['id'] != null;
    });

    this.initForm();
    this.validImage = this.editMode;

    console.log(this.contactData.controls);
  }

  private async initForm() {
    this.personForm = this.formBuilder.group({
      id: this.id,
      imageUrl: new FormControl(null, Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      contacts: new FormArray([]),
    });

    (<FormControl>this.personForm.get('firstName')).updateValueAndValidity();

    if (this.editMode) {
      let person;
      let imageUrl = '';
      let firstName = '';
      let lastName = '';
      const data = new FormArray([]);

      try {
        person = await lastValueFrom(this.apiService.findPerson(this.id));
        imageUrl = person.imageUrl;
        firstName = person.firstName;
        lastName = person.lastName;

        person.contact.forEach((contact) => {
          this.contactData.push(this.newData(contact));
        });
      } catch (error) {
        this.router.navigate(['../'], { relativeTo: this.route });
      }

      this.personForm.patchValue({
        imageUrl: imageUrl,
        firstName: firstName,
        lastName: lastName,
      });
    }
  }

  get contactData(): FormArray {
    return this.personForm.get('contacts') as FormArray;
  }

  get imageurl(): string {
    return this.personForm.get('imageUrl')?.value;
  }

  set imageurl(url: string) {
    this.personForm.patchValue({
      imageUrl: url,
    });
  }

  private newData(data: Contact | null = null): FormGroup {
    const form: FormGroup = this.formBuilder.group({
      category: new FormControl(data?.type, Validators.required),
      value: new FormControl(data?.value),
    });

    const categoryControl: FormControl = form.get('category') as FormControl;
    const valueControl: FormControl = form.get('value') as FormControl;

    categoryControl.valueChanges.subscribe((categoryType) => {
      if (
        categoryType == Categories.PHONE_NUMBER ||
        categoryType == Categories.HOME_NUMBER
      ) {
        valueControl.setValidators(
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')
        );
      } else if (categoryType == Categories.EMAIL) {
        valueControl.setValidators(Validators.email);
      }
    });

    return form;
  }

  private getComponentId(params: Params) {
    return +params['id'] ? +params['id'] : this.personService.getLength() + 1;
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSumbit() {
    if (this.editMode) {
      this.personService.updateConact(this.personForm.value as Person);
    } else {
      if (!this.imageurl) {
        this.imageurl = this.defaultProfileImageURL;
      }
      this.personService.addPerson(this.personForm.value as Person);
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
      const imageUrl: string = control.value;

      if (!control.value) return of(null);

      return control.valueChanges
        .pipe(
          map(() => (this.validImage = false)),
          debounceTime(500),

          distinctUntilChanged(),
          switchMap((value) => this.personService.fetchValidImageURL(imageUrl)),
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
