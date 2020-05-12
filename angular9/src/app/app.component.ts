import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, Form } from '@angular/forms';
import { formSignup } from './formSignup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: any;
  FormGroup: FormGroup;
  signupForm: FormGroup;
  firstName: string = '';
  lastName: string = '';
  email: string = '';

  constructor(private router: Router, private fb: FormBuilder) {
    this.signupForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', [Validators.required, Validators.maxLength(5)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnInit() {
    // this.signupForm.get('firstName').valueChanges.subscribe(
    //   uname => {
    //     console.log("fname change:" + uname);
    //   }
    // )

    this.signupForm.valueChanges.subscribe((uname: formSignup) => {
      console.log("fname change:" + uname.firstName);
      console.log("lname change:" + uname.lastName);
      console.log("email change:" + uname.email);
    });

    this.form = new FormGroup({
      contactNo: new FormArray([
        new FormControl('123456789'),
        new FormControl('0987654321')
      ])
    });
  }
  Preset() {
    this.form.get('contactNo').patchValue(['23456789', '123456789']);
  }
  addContact() {
    (this.form.get('contactNo') as FormArray).push(new FormControl());

  }
  submitArray() {
    console.log(this.form.get('contactNo').value);
    console.log(this.form.value)
  }

  emp = [
    { "id": "1", "name": "Swati", gender: "female" },
    { "id": "2", "name": "Atul", gender: "male" },
    { "id": "3", "name": "Amol", gender: "male" },
  ]


  Register(regForm: any) {
    alert("Hello");
    var firstName = regForm.controls.firstName.value;
    console.log(regForm);
  }

  PostData(signupForm) {
    var firstname = this.signupForm.get('firstName').value;
    console.log("firstname", firstname)
  }
  resetForm() {
    this.signupForm.reset({
      firstName: "swati"
    });
  }
  fillData() {
    this.signupForm.patchValue({
      "firstName": "Atul",
      "lastName": "Tayade"

    })
  }
}
