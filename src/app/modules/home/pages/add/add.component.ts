import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  contactForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm() {
    let imageURL = '';
    let firstName = '';
    let lastName = '';
    let data = new FormArray([]);

    this.contactForm = this.formBuilder.group({
      imageURL: new FormControl(imageURL, Validators.required),
      firtName: new FormControl(firstName, Validators.required),
      lastName: new FormControl(lastName, Validators.required),
      contactData: data,
    });
  }

  get contactData(): FormArray {
    return this.contactForm.get('contactData') as FormArray;
  }

  private newData(): FormGroup {
    return this.formBuilder.group({
      category: new FormControl(null),
      text: new FormControl(null, Validators.required),
    });
  }

  addCategory() {
    this.contactData.push(this.newData());
  }

  removeCategory(index: number) {
    this.contactData.removeAt(index);
  }

  onSumbit() {
    console.log(this.contactForm.value);
  }
}
