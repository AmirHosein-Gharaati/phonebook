import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  id: number;
  contactForm: FormGroup;
  editMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
      console.log(this.editMode);
      
      this.initForm();
    });
  }

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
      text: new FormControl(null),
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
    this.editMode = false;
  }
}
