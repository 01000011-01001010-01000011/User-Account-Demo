import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule} from '@angular/forms';


import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SideNavBarComponent } from './components/sidenavbar/sidenavbar.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './components/register/register.component';
import { UpdateComponent } from './components/update/update.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';


/*
import { HomeComponent } from './home';

import { RegisterComponent } from './register';
import { AlertComponent } from './_components';*/



// used to create fake backend
//import { fakeBackendProvider } from './_helpers';

// import { JwtInterceptor, ErrorInterceptor } from './_helpers';


@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    DashboardComponent,
    SideNavBarComponent,
    LoginComponent,
    RegisterComponent,
    UpdateComponent,
    ResetpasswordComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,      
    BrowserAnimationsModule,
    MatDividerModule
  ],
  providers: [  
   // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
   // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    //fakeBackendProvider], 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
