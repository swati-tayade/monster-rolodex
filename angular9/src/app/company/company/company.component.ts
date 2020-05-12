import { Component, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, Form } from '@angular/forms';


@Component({
    selector: 'app-root',
    template: `
    <h1>company works..</h1> 
    <a [routerLink]= "['companyDetail']" routerLinkActive = "active">company Detail</a>
    <router-outlet></router-outlet>
    `

})
export class CompanyComponent implements OnInit {
    ngOnInit() {

    }

}
