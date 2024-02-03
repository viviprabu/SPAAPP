import { Routes } from "@angular/router";
import { BranchComponent } from "../branch/branch.component";
import { CountryComponent } from "../country/country.component";
import { CustomerComponent } from "../customer/customer.component";
import { HomepageComponent } from "../homepage/homepage.component";
import { NavbarrightComponent } from "../navbarright/navbarright.component";
import { PaymentComponent } from "../payment/payment.component";
import { RoleComponent } from "../role/role.component";
import { ServicesComponent } from "../services/services.component";
import { TherapistComponent } from "../therapist/therapist.component";
import { TransactionComponent } from "../transaction/transaction.component";

import { AuthGuard } from "../guard/guard.guard";
import { UserComponent } from "../user/user.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { InvoiceComponent } from "../invoice/invoice.component";
import { BookingScheduleComponent } from "../booking-schedule/booking-schedule.component";
import { EventsComponent } from "../add-events/events.component";
import { BookingInvoiceComponent } from "../booking-invoice/booking-invoice.component";
import { CurrencyComponent } from "../currency/currency.component";
import { CompanyComponent } from "../company/company.component";
import { ShiftComponent } from "../shift/shift.component";
import { ShowbranchComponent } from "../showbranch/showbranch.component";
import { BookingWizardComponent } from "../booking-wizard/booking-wizard.component";
import { GuestHomeComponent } from "../guest-home/guest-home.component";
import { SlotTimingComponent } from "../slottiming/slottiming.component";
import { ModifyEventComponent } from "../modify-event/modify-event.component";





 export const content: Routes=[
    //  {path:'contentlayout',component:ContentlayoutComponent},
    //  {path:'login', component: LoginComponent},
    
     {path:'homepage', component: HomepageComponent,canActivate:[AuthGuard]},
      {path:'branch',component:BranchComponent,canActivate:[AuthGuard]},
      {path:'country',component:CountryComponent,canActivate:[AuthGuard]},
      {path:'navbarright',component:NavbarrightComponent,canActivate:[AuthGuard]},
      {path:'customer',component:CustomerComponent,canActivate:[AuthGuard]},
      {path:'payment',component:PaymentComponent,canActivate:[AuthGuard]},
      {path:'therapist',component:TherapistComponent,canActivate:[AuthGuard]},
      {path:'role',component:RoleComponent,canActivate:[AuthGuard]},
      {path:'services',component:ServicesComponent,canActivate:[AuthGuard]},
      {path:'role',component:RoleComponent,canActivate:[AuthGuard]},
      {path:'transaction',component:TransactionComponent,canActivate:[AuthGuard]},
      {path:'user',component:UserComponent,canActivate:[AuthGuard]},
      {path:'dashboard', component: DashboardComponent,canActivate:[AuthGuard]},
      {path:'sidebar', component: SidebarComponent,canActivate:[AuthGuard]},
      {path:'invoice', component: InvoiceComponent,canActivate:[AuthGuard]},
      {path:'booking-schedule', component: BookingScheduleComponent,canActivate:[AuthGuard]},
      {path:'events', component: EventsComponent,canActivate:[AuthGuard]},
      {path:'booking-invoice', component: BookingInvoiceComponent,canActivate:[AuthGuard]},
      {path:'currency', component: CurrencyComponent,canActivate:[AuthGuard]},
      {path:'company', component: CompanyComponent,canActivate:[AuthGuard]},
      {path:'shift', component: ShiftComponent,canActivate:[AuthGuard]},
      {path:'showbranch', component: ShowbranchComponent,canActivate:[AuthGuard]},
      {path:'booking-wizard', component: BookingWizardComponent,canActivate:[AuthGuard]},
      {path:'guest-home', component: GuestHomeComponent,canActivate:[AuthGuard]},
      {path:'slottime', component: SlotTimingComponent,canActivate:[AuthGuard]},
      {path:'modify-event', component: ModifyEventComponent,canActivate:[AuthGuard]},
      
      
      



]
