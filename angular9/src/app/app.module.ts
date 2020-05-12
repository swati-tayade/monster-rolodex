import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyPipePipe } from './my-pipe.pipe';
import { PageNotfoundComponent } from './page-notfound/page-notfound.component';
import { RouterModule } from '@angular/router';
//import { CompanyModule } from './company/company/company.module';

@NgModule({
  declarations: [
    AppComponent,
    MyPipePipe,
    PageNotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
    // CompanyModule
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule {
  constructor() {
    console.log("App loaded..")
  }
}
