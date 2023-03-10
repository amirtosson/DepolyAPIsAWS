import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlyingBtnComponent } from './ui-components/flying-btn/flying-btn.component';
import { AddNewDatasetComponent } from "./datasets/add-new-dataset/add-new-dataset.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { UserLoginComponent } from './user/user-login/user-login.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { UserprofileComponent } from './user/userprofile/userprofile.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { SideBarComponent } from './ui-components/side-bar/side-bar.component';
import { DashboardHomeComponent } from './user/user-dashboard/dashboard-child-pages/dashboard-home/dashboard-home/dashboard-home.component';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardDatasetsListComponent } from './user/user-dashboard/dashboard-child-pages/dashboard-datasets-list/dashboard-datasets-list.component';
import { DatasetWorkingPageComponent } from "./datasets/dataset-working-page/dataset-working-page.component";



@NgModule({
  declarations: [
    AppComponent,
    FlyingBtnComponent,
    AddNewDatasetComponent,
    LandingPageComponent,
    UserLoginComponent,
    SignUpComponent,
    UserprofileComponent,
    UserDashboardComponent,
    SideBarComponent,
    DashboardHomeComponent,
    DashboardDatasetsListComponent,
    DatasetWorkingPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
