import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotfoundComponent } from './page-notfound/page-notfound.component';
import { CompanyComponent } from './company/company/company.component';



const routes: Routes = [
  {
    path: 'company',
    loadChildren: 'app/company/company/company.module#CompanyModule'
  },
  // { path: 'company', component: CompanyComponent },
  { path: '**', component: PageNotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
