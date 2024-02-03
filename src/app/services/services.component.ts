import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Services } from '../model/services';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../service/services.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PassvalueService } from '../service/passvalue.service';
import { Country } from '../model/country';
import { CountryService } from '../service/country.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit,AfterViewInit,AfterContentChecked{
  isSearch:boolean = false;
  searchDto:Services[];
  formCname: string="";
  ctryName:any;
  serviceDto:Services[]=[];
  serviceFormGroup: FormGroup;
  searchFormGroup:FormGroup;
  isActiveValue:boolean = false;
  isChecked : boolean = false;
  isModify:boolean = false;
  searchTerm:string="";
  onSubmit:boolean;
  isCheckedMap:boolean=false;
  countryDto: Country[]=[];
  page = 1;
  pageSize=15;
  servicePageDto:Services[]=[];
  constructor(private formBuilder: FormBuilder, private servicesService: ServicesService,
    private modalService:NgbModal,private passService:PassvalueService, private countryService: CountryService,private ref: ChangeDetectorRef)
  {
    this.serviceFormGroup = this.formBuilder.group({
      id:[0],
      name:["", Validators.required],
      description:[""],
      price:[0],
      isActive:[true],
      serviceTime:[0,Validators.required]

    });

    this.searchFormGroup = this.formBuilder.group({
      id:[0],
      sname:["", Validators.required],
      description:[""],
      price:[0],
      isActive:[true],
      serviceTime:[0,Validators.required]
    });
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   this.ref.detectChanges()
  // }
  ngAfterContentChecked(): void {
    
      this.refreshSlots();
    
    
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
    
    this.ref.detectChanges()
    }
    ,0)
    
  }

  ngOnInit() {
    
    this.loadMasterDatas();
    this.passService.setformHeader('Services');
    // this.isChecked==true;

  }
loadMasterDatas()
{
  this.countryService.getCountry().subscribe(res=>this.countryDto = res)
  this.servicesService.getService().subscribe(res=>this.serviceDto = res)
}
  refreshSlots()
  {
    this.servicePageDto = this.serviceDto.map((slots, i) => ({ id: i + 1, ...slots })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }
  
 

  saveService()
  {
    if(this.serviceFormGroup.valid)
    {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
  
        if (result.isConfirmed) {
          this.servicesService.createService(this.serviceFormGroup.value).subscribe((res:any) => {
            // //console.log(res.value);
  
            this.serviceDto.push(res.value);
            this.serviceFormGroup.reset();
            this.resetForm();
            // Swal.fire('Saved!', '', 'success')
          },err=>{
              Swal.fire('Failed!', err.message, 'error')
            });
  
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      }
      )
    }
    else
    {
      this.onSubmit = true;
    }
    
  }
  getRecords(ser: Services)
  {

    this.serviceFormGroup.controls['id'].setValue(ser.id);
    this.serviceFormGroup.controls['name'].setValue(ser.name);
    this.serviceFormGroup.controls['description'].setValue(ser.description);
    this.serviceFormGroup.controls['price'].setValue(ser.price);
    this.serviceFormGroup.controls['isActive'].setValue(ser.isActive);
    this.serviceFormGroup.controls['serviceTime'].setValue(ser.serviceTime);
    this.isActiveValue = ser.isActive;
    if (this.isActiveValue == true)
    {
      this.isChecked = true;// //console.log(br.isActive)
    }
    else    {
      this.isChecked = false;
    }
    this.isModify = true;

  }
  modifyService()
  {
    Swal.fire({
      title: "Do you want to modify the changes?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Modify",
      denyButtonText: `Don't Modify`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      this.servicesService.updateService(this.serviceFormGroup.value).subscribe({
        next:(res=>{
          // //console.log(res);
      
        this.serviceFormGroup.reset();
        this.isModify = false;
        location.reload();  

        }),
        error:(err=>{
          // alert(err?.error.message)
          // this.toast.error({detail:"ERROR",summary:err?.error.message,duration:5000});
          Swal.fire({
            title: "Sorry",
            text: err?.error.message, 
            icon:'warning'
     
          });
     
        })
        
      })
      if (result.isConfirmed) {

        // Swal.fire("Modified!", "", "success");
      } else if (result.isDenied) {
        this.isModify=false;
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }


deleteService(ser:Services)
{
  if(ser.isActive == false)
  {
    Swal.fire("This service already deleted")
  }
  else
  {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {


    if (result.isConfirmed) {
      this.servicesService.deleteService(ser).subscribe(res=>{
        //console.log(res)
        //this.getEmployee();
        this.serviceDto.splice(this.serviceDto.findIndex(x=>x.id == ser.id), 1);
        location.reload();
    })

      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    }
    else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  });
}
}

onCheckboxChange(e) {

  const website: FormArray = this.serviceFormGroup.get('isActive') as FormArray;

  if (e.target.checked == true) {

    // //console.log(e.target.checked)
    this.isChecked = e.target.checked;
    this.serviceFormGroup.controls['isActive'].setValue(this.isChecked)
    //console.log(this.isChecked);

  } else {

    // //console.log(e.target.checked)
    this.isChecked = e.target.checked;
    this.serviceFormGroup.controls['isActive'].setValue(this.isChecked);
    //console.log(this.isChecked);
  }
}
resetForm()
  {
    this.serviceFormGroup.controls['id'].setValue(0);
    this.serviceFormGroup.controls['isActive'].setValue(true);
  }
  Cancel()
  {
    this.isModify=false;
    this.serviceFormGroup.reset();
  }


  // searchCountry()
  // {
  //   this.formCname = this.searchFormGroup.controls['sname'].value;

  //   // //console.log(this.formCname)
  //   if(this.formCname === '')
  //   {
  //     Swal.fire("Please enter required Country to search?");
  //   }
  //   else
  //   {
  //     this.searchDto = this.serviceDto.filter((element)=>{
  //       return element.name.toLowerCase() == this.formCname.toLowerCase();
  //     })
  //      this.isSearch = true;
  //   }

  // }
  // onServiceChange(e)
  // {
  //   if(e.target.value)
  //   {
  //     this.searchDto = this.serviceDto.filter((element)=>{
  //       return element.name.substring(0,2).toLowerCase() == e.target.value.substring(0,2).toLowerCase()
  //     })
  //      this.isSearch = true;
  //   }
  //   else
  //   {
  //     this.isSearch = false;
  //   }

  // }
  // CancelSearch()
  // {
  //   this.searchFormGroup.reset();
  //   this.isSearch = false;
  //   this.getServiceList();

  // }
  close()
  {
    this.modalService.dismissAll();
  }
  deleteRows()
  {
    window.location.reload();
  }
  addNew(){
    this.isModify = false;
    this.serviceFormGroup.reset();
   
    this.serviceFormGroup.controls['id'].setValue(0);
    this.serviceFormGroup.controls['isActive'].setValue(true);
    
  }
  check(e)
  {
    if(e.target.checked)
    {
      this.isCheckedMap = true;
    }
    else
    {
      this.isCheckedMap = false;
    }
    // this.isCheckedMap = !this.isCheckedMap
  }
}
