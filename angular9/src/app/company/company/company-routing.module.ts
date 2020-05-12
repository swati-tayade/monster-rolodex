import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './company.component';
import { CompanyDetailComponent } from '../company-detail/company-detail.component';


const companyRoutes: Routes = [
    {
        path: '',
        component: CompanyComponent,
        children: [
            {
                path: 'companyDetail',
                component: CompanyDetailComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(companyRoutes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule { }
