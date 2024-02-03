import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AppService } from './app.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {NestedTreeControl} from '@angular/cdk/tree';
// import {MatTreeNestedDataSource, MatTreeModule} from '@angular/material/tree';
// import {MatIconModule} from '@angular/material/icon';
// import {MatButtonModule} from '@angular/material/button';
import { BranchComponent } from './branch/branch.component';
import { CountryComponent } from './country/country.component';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarrightComponent } from './navbarright/navbarright.component';
import { CustomerComponent } from './customer/customer.component';
import { PaymentComponent } from './payment/payment.component';
import { TherapistComponent } from './therapist/therapist.component';
import { ServicesComponent } from './services/services.component';
import { RoleComponent } from './role/role.component';
import { TransactionComponent } from './transaction/transaction.component';
import { CommonModule } from '@angular/common';
import { ContentlayoutComponent } from './contentlayout/contentlayout.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { UserComponent } from './user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { NgxSearchFilterModule } from 'ngx-search-filter';
import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { NgChartsModule } from 'ng2-charts';
// import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { Transaction } from './model/transaction';
import { ResetComponent } from './reset/reset.component';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { StatusbarComponent } from './statusbar/statusbar.component';

import { SidebarMinimizedComponent } from './sidebar-minimized/sidebar-minimized.component';
import { BookingScheduleComponent } from './booking-schedule/booking-schedule.component';
import { EventsComponent } from './add-events/events.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BookingInvoiceComponent } from './booking-invoice/booking-invoice.component';
import { CurrencyComponent } from './currency/currency.component';
import { CompanyComponent } from './company/company.component';
import { ShiftComponent } from './shift/shift.component';
import { ShowbranchComponent } from './showbranch/showbranch.component';
import { BookingWizardComponent } from './booking-wizard/booking-wizard.component';
import { GuestHomeComponent } from './guest-home/guest-home.component';
import { SlotTimingComponent } from './slottiming/slottiming.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ModifyEventComponent } from './modify-event/modify-event.component';








// const dbConfig:DBConfig = {
//   name: 'myDb',
//   version: 1,
//   objectStoresMeta: [{
//     store:'users',
//     storeConfig:{keyPath:'id',autoIncrement:false},
//     storeSchema:[
//       {name:'userId',keypath:'userId',options:{unique:false}},
//       {name:'username',keypath:'username',options:{unique:false}}
//     ]
//   }
// ]
// };



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    BranchComponent,
    CountryComponent,
    NavbarrightComponent,
    BookingScheduleComponent,
    EventsComponent,
    CustomerComponent,
    PaymentComponent,
    TherapistComponent,
    ServicesComponent,
    RoleComponent,
    TransactionComponent,
    ContentlayoutComponent,
        SignupComponent,
        UserComponent,
        DashboardComponent,
        SidebarComponent,
        InvoiceComponent,
        ResetComponent,
        StatusbarComponent,
        SidebarMinimizedComponent,
        BookingInvoiceComponent,
        CurrencyComponent,
        CompanyComponent,
        ShiftComponent,
        ShowbranchComponent,
        BookingWizardComponent,
        GuestHomeComponent,
        SlotTimingComponent,
        CalendarComponent,
        ModifyEventComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxSearchFilterModule,
    NgxChartsModule,
    NgbModule,
    FullCalendarModule,
    NgbPaginationModule
  ],

  providers: [AppService,{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi : true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
