import { CountryService } from './../service/country.service';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country, countryChecked } from '../model/country';
import Swal from 'sweetalert2';
import { PassvalueService } from '../service/passvalue.service';
import { EMPTY } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { id } from '@swimlane/ngx-charts';
import { Currency } from '../model/currency';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit,AfterViewInit,AfterContentChecked{
  searchTerm: string="";
  isSearch:boolean = false;
  searchDto:Country[]=[];
  formCname: string="";
  ctryName:any;
  countryDto:Country[]=[];
  countryFormGroup: FormGroup;
  searchFormGroup:FormGroup;
  isActiveValue:boolean = false;
  isChecked : boolean = false;
  isModify:boolean = false;
  isCheckedMap:{};
  checkedRows:countryChecked[]=[];
  deleteDto:countryChecked[]=[];
  idList:[]=[];
  isSubmit : boolean = false;
  currencyDto: Currency[]=[];
  formHeader:string=""
  
  countryPageDto:Country[]=[];
  page=1;
  pageSize=15;
  constructor(private formBuilder: FormBuilder, private countryService:CountryService,
    private passService : PassvalueService, private modalService: NgbModal, private currencyService: CurrencyService,private ref: ChangeDetectorRef)
  {

    

    this.countryFormGroup = this.formBuilder.group({
      id:[0],
      name:["", Validators.required],
      isActive:[true],
      defaultCurrencyId:[0],
      alternateCurrencyId:[0]
    });

    this.searchFormGroup = this.formBuilder.group({
      id:[0],
      cname:["", Validators.required],
      isActive:[true],
      defaultCurrencyId:[0],
      alternateCurrencyId:[0]
    });

  }
  ngAfterContentChecked(): void {
    this.refreshPages();
  }
   ngAfterViewInit(): void {
    setTimeout(()=>{
      this.passService.setformHeader("Country");
      
    this.ref.detectChanges()
    }
    ,0)
    
  }
  ngOnInit() {
   this.loadMasterDatas();

  }
  loadMasterDatas()
  {
    this.countryService.getCountry().subscribe(res=>{this.countryDto = res;this.searchDto = res; });
    this.currencyService.getCurrency().subscribe(res=>this.currencyDto = res)
  }
 
  refreshPages()
  {
    this.countryPageDto = this.searchDto.map((slots, i) => ({ id: i + 1, ...slots })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }
addNew(){
  this.isModify = false;
  this.countryFormGroup.reset();
  this.countryFormGroup.controls['isActive'].setValue(true);
  this.countryFormGroup.controls['id'].setValue(0);
  
}
  saveCountry()
  {
    if(this.countryFormGroup.valid)
    {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {

        if (result.isConfirmed) {
          this.countryService.createCountry(this.countryFormGroup.value).subscribe((res:any) => {
            // //console.log(res.value);

            this.countryDto.push(res.value);
            this.countryFormGroup.reset();
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
      this.validateAllFormFields(this.countryFormGroup)
    }

  }
  getRecords(ctry: Country)
  {

    this.countryFormGroup.controls['id'].setValue(ctry.id);
    this.countryFormGroup.controls['name'].setValue(ctry.name);
    this.countryFormGroup.controls['isActive'].setValue(ctry.isActive);
    this.isActiveValue = ctry.isActive;
    if (this.isActiveValue == true)
    {
      this.isChecked = true;// //console.log(br.isActive)
    }
    else    {
      this.isChecked = false;
    }
    this.isModify = true;

  }
  modifyCountry()
  {
    Swal.fire({
      title: "Do you want to modify the changes?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Modify",
      denyButtonText: `Don't Modify`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      this.countryService.updateCountry(this.countryFormGroup.value).subscribe(res=>{
        //console.log(res);
        location.reload();
        this.countryFormGroup.reset();
        this.isModify = false;
          window.location.reload();
      })
      if (result.isConfirmed) {

        // Swal.fire("Modified!", "", "success");
      } else if (result.isDenied) {
        this.isModify=false;
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }


deleteCountry(ctry:Country)
{
  if(ctry.isActive == false)
  {
    Swal.fire("This country already deleted")
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
      this.countryService.deleteCountry(ctry).subscribe(res=>{
        //console.log(res)
        //this.getEmployee();
        this.countryDto.splice(this.countryDto.findIndex(x=>x.id == ctry.id), 1);
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

  const website: FormArray = this.countryFormGroup.get('isApproved') as FormArray;

  if (e.target.checked == true) {

    // //console.log(e.target.checked)
    this.isChecked = e.target.checked;
    this.countryFormGroup.controls['isActive'].setValue(this.isChecked)


  } else {

    // //console.log(e.target.checked)
    this.isChecked = e.target.checked;
    this.countryFormGroup.controls['isActive'].setValue(this.isChecked);

  }
}
resetForm()
  {
    this.countryFormGroup.controls['id'].setValue(0);
    this.countryFormGroup.controls['isActive'].setValue(true);
  }
  Cancel()
  {
    this.isModify=false;
    this.countryFormGroup.reset();
    this.modalService.dismissAll();
  }
 

  // searchCountry()
  // {
  //   this.formCname = this.searchFormGroup.controls['cname'].value;

  //   // //console.log(this.formCname)
  //   if(this.formCname == '')
  //   {
  //     Swal.fire("Please enter required Country to search?");
  //   }
  //   else
  //   {
  //     this.searchDto = this.countryDto.filter((element)=>{
  //       return element.name.toLowerCase() == this.formCname.toLowerCase();
  //     })
  //     this.countryDto = this.searchDto;

  //     // //console.log(this.countryDto);
  //     this.isSearch = true;
  //   }

  // }
  // CancelSearch()
  // {
  //   this.searchFormGroup.reset();
  //   this.isSearch = false;
  //   this.getCountryList();

  // }
  private validateAllFormFields(formGrop:FormGroup){
    Object.keys(formGrop.controls).forEach(element => {
      const control = formGrop.get(element);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true});
      }
      else if(control instanceof FormGroup)
      {
        this.validateAllFormFields(control)
      }
    });

  }
  close()
  {
    document.getElementById('closeModal').click();
  }

  deleteRows()
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

    // let selectedCountries: Country[]=[];
    // selectedCountries = this.deleteDto;
    // console.log(selectedCountries);
    
    if (result.isConfirmed) {
      this.countryService.deleteAllCountry(this.deleteDto).subscribe(res=>{
        console.log(res)
        //this.getEmployee();  
           
        this.countryDto = res;
      this.searchDto = res;  
    })
    
    location.reload();

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

  onSelectedAll(e)
  {
    this.countryService.getCountry().subscribe((res:any)=>{
      this.countryDto = res;
    })
    

    if(e.target.checked)
    {
      this.isCheckedMap = true;
    
      this.countryDto.filter((x:any)=>{
        this.deleteDto.push(x.id)
      })
      
    }
    else
    {
      this.isCheckedMap = false;
      this.deleteDto=[];
      
    }
    
  }
  onSelected(e,row)
  {
  
  //  const checkbox =  document.getElementById('countryCheck') as HTMLInputElement | null

    if(e.target.checked)
    {
      
      this.deleteDto.push(row);
    }
    else
    {
           
      const idx = this.deleteDto.findIndex(x=>x.id == row);
    this.deleteDto.splice(idx,1);
   
      
    }
   
    
    console.log(this.deleteDto)
  }

}
