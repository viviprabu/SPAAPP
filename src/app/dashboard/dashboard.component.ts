import { TherapistSales } from './../model/therapistSales';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UserStoreService } from '../service/user-store.service';
import { AuthService } from '../service/auth.service';
import { CustomerService } from '../service/customer.service';
import { DashboardService } from '../service/dashboard.service';
import { single } from './data';
import { BaseChartDirective } from 'ng2-charts';
import { PassvalueService } from '../service/passvalue.service';
import { AppService } from '../app.service';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit,AfterViewInit{

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public fullName : string = "";
  therapistSalesDto:TherapistSales[]=[];

  dashData : TherapistSales[] =  []
  // showXAxis = true;
  // showYAxis = true;
  // gradient = false;
  // showLegend = true;
  // showXAxisLabel = true;
  // xAxisLabel = 'Therapist';
  // showYAxisLabel = true;
  // yAxisLabel = 'TotalSales';
  single: any[];
  multi: any[];

  view: any[] = [700, 400];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Therapist';
  showYAxisLabel = true;
  yAxisLabel = 'Total Sales';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    
  };
  formHeader:string=""
  constructor(private userStore: UserStoreService,private auth: AuthService,
   private customerService: CustomerService, private dashboardService: DashboardService, private passService: PassvalueService, private appService: AppService,
   private ref: ChangeDetectorRef, private passValue: PassvalueService ){
    
    



  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.ref.detectChanges()
  // }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.passValue.setformHeader("Dashboard");
    
    this.ref.detectChanges()
    }
    ,0)
    
  }



  ngOnInit(): void {
   
    // this.passService.setformHeader('Dashboard')
    this.dashboardService.getTherapistSales().subscribe(res=>
      {
        this.therapistSalesDto = res;
        this.dashData = res;

        //Object.assign(single, res)


        //console.log(res)
        //console.log(single)
      }
    );
    this.getName();


  }
  onSelect(event) {
    //console.log(event);
  }




  getName()
  {
    this.userStore.getFullNameFromStore().subscribe(res=>{
      var fullNameFromToken = this.auth.getFullNamefromToken();
      this.fullName = res || fullNameFromToken
      // //console.log(this.fullName)
      // location.reload();
    });
  }

}
