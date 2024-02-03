import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Company } from '../model/company';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Branch } from '../model/branch';
import { Country } from '../model/country';
import { BranchService } from '../service/branch.service';
import { CompanyService } from '../service/company.service';
import { CountryService } from '../service/country.service';
import { PassvalueService } from '../service/passvalue.service';
import Swal from 'sweetalert2';
import { CurrencyService } from '../service/currency.service';
import { Currency } from '../model/currency';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit,AfterViewInit,AfterContentChecked{
  onSubmit:boolean = false;
  searchTerm: string = "";
  formBname:string="";
  formCname:number = 0;
  searchDto : Company[]=[];
  isSubmit: boolean = false;
  //isSearch:boolean = false;
  isActiveValue:boolean = false;
  isModify : boolean = false;
  isChecked: boolean = false;
  companyFormGroup : FormGroup;
  searchFormGroup: FormGroup;
  branchDto: Branch[]=[];
  branchDtl: Branch[]=[];
  countryDto:Country[]=[];
  countryDtl: any;
  branchId : number = 0;
  isCheckedMap:boolean = false;
  companyDto : Company[]=[];
  currencyDto:Currency[]=[];
  formHeader:string=""
  companyPageDto:Company[]=[];
  page=1;
  pageSize=15;

  constructor(private formbuilder: FormBuilder, private companyService: CompanyService, 
    private countryService: CountryService,private passService: PassvalueService,private currencyService: CurrencyService,private ref: ChangeDetectorRef)
  {
 
 
    this.companyFormGroup = this.formbuilder.group({
      id:[0],
      name:["", Validators.required],
      currencyId:[0,Validators.required],
      alternateCurrencyId:[0,Validators.required],
      currencyCode:[0,Validators.required],
      conversionRate:[0,Validators.required],
      isActive:[true],
      
      

    });
    this.searchFormGroup = this.formbuilder.group({
      id:[0],
      name:["", Validators.required],
      currencyId:[0,Validators.required],
      alternateCurrencyId:[0,Validators.required],
      currencyCode:[0,Validators.required],
      conversionRate:[0,Validators.required],
      isActive:[true],


    })
  }
  ngAfterContentChecked(): void {
    this.refreshPages();
  }
  
  ngAfterViewInit(): void {
    setTimeout(()=>{
      
      this.passService.setformHeader("Company");
    this.ref.detectChanges()
    }
    ,0)
    
  }
  ngOnInit() {
   

    this.loadMasterDatas();

//this.isSearch = false;
  }
  loadMasterDatas()
  {
    this.currencyService.getCurrency().subscribe(res=>this.currencyDto = res)
    this.companyService.getCompany().subscribe(res=>{this.companyDto = res; this.searchDto = res})
    this.countryService.getCountry().subscribe(ctres=>this.countryDto = ctres)
  }
  refreshPages()
  {
    this.companyPageDto = this.companyDto.map((slots, i) => ({ id: i + 1, ...slots })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }


// onSelectCountry(e)
// {
  
//   this.countryDto.filter(x=>{
//     if(x.id == e.target.value)
//     {
//       const currencyId = x.defaultCurrencyId
//       const alternateId = x.alternateCurrencyId
//       console.log(currencyId,alternateId)
//       this.currencyDto.filter(y=>{
//         if(y.id == x.defaultCurrencyId)
//         {
//           this.branchFormGroup.controls['currencyId'].setValue(y.name)   
//           this.branchFormGroup.controls['alternateId'].setValue(y.name)   
//         }
            
        
//       })
  
//     }
//   })
// }
  saveBranch()
  {
    this.isSubmit == true;
    if(this.companyFormGroup.valid)
    {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {

        if (result.isConfirmed) {
         
          this.companyService.createCompany(this.companyFormGroup.value).subscribe((res:any) => {
            // //console.log(res.value);

            this.companyDto.push(res.value);
            this.companyFormGroup.reset();
            this.resetForm();
            // Swal.fire('Saved!', '', 'success')
            this.isSubmit == false;
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
      this.isSubmit = true;
      // this.validateAllFormFields(this.branchFormGroup)
    }


  }
  getRecords(br:Company)
  {

    this.companyFormGroup.controls['id'].setValue(br.id);
    // this.branchId = br.id;
    // //console.log(br.id);
    this.companyFormGroup.controls['name'].setValue(br.name);
    this.companyFormGroup.controls['currencyId'].setValue(br.currencyId);
    this.companyFormGroup.controls['alternateCurrencyId'].setValue(br.alternateCurrencyId);
    this.companyFormGroup.controls['currencyCode'].setValue(br.currencyCode);
    

    this.isActiveValue = br.isActive;
    if (this.isActiveValue == true)
    {
      this.isChecked = true;// //console.log(br.isActive)
    }
    else    { this.isChecked = false; } this.isModify = true;

  }
  modifyBranch()
  {
    var branch:Branch;
    Swal.fire({
      title: "Do you want to modify the changes?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Modify",
      denyButtonText: `Don't Modify`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        this.companyService.updateCompany(this.companyFormGroup.value).subscribe(res=>{
          //console.log(res);
          location.reload()
          this.companyFormGroup.reset();
          this.isModify = false;
          window.location.reload();
        })

        // Swal.fire("Modified!", "", "success");
      } else if (result.isDenied) {
        this.isModify = false;
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }

  resetForm()
  {
    this.companyFormGroup.controls['id'].setValue(0);
    this.companyFormGroup.controls['isActive'].setValue(true);
  }

deleteBranch(br:Company)
{
  if(br.isActive == false)
  {
    Swal.fire("This branch already deleted")
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
      this.companyService.deleteCompany(br).subscribe(res=>{
        //console.log(res)
        //this.getEmployee();

        this.companyDto.splice(this.companyDto.findIndex(x=>x.id == br.id), 1);
        location.reload();
    })
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    }
    else if (result.isDenied)
    {

        Swal.fire('Changes are not saved', '', 'info')

    }
  });
}
}

Cancel()
{
  this.isModify = false;
  this.companyFormGroup.reset();
}

searchBranch()
{

  this.formBname = this.searchFormGroup.controls['name'].value;
  this.formCname = this.searchFormGroup.controls['countryId'].value;

  if(this.formBname != '')
  {
    this.searchDto = this.companyDto.filter((element)=>
      {return element.name.toLowerCase() == this.formBname.toLowerCase()})
      //this.isSearch = true;
  }
  else{
    Swal.fire("Please enter Branch Name to search?");
  }
}
// onSelectionChange(e)
// {
//   this.formBname = this.searchFormGroup.controls['name'].value;

//   if(this.formBname == '')
//   {
//     this.searchDto = this.companyDto.filter((element)=>{
//       return element.countryId == e.target.value })
//       //this.isSearch = true;
//   }
//   else
//   {
//     this.searchDto = this.branchDto.filter((element)=>{
//       return element.countryId == e.target.value && element.name.toLowerCase() == this.formBname.toLowerCase() })
//       //this.isSearch = true;
//   }


// }
cancelSearch()
{
location.reload()
}
deleteRows()
{
  
}
addNew()
{
  this.isModify = false;
  this.companyFormGroup.reset();
  this.companyFormGroup.controls['isActive'].setValue(true);
  this.companyFormGroup.controls['id'].setValue(0);
  
}
// private validateAllFormFields(formGrop:FormGroup){
//   Object.keys(formGrop.controls).forEach(element => {
//     const control = formGrop.get(element);
//     if(control instanceof FormControl){
//       control.markAsDirty({onlySelf:true});
//     }
//     else if(control instanceof FormGroup)
//     {
//       this.validateAllFormFields(control)
//     }
//   });

// }
close()
  {
    document.getElementById('closeModal').click();
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
function showErrorAlert() {
  throw new Error('Function not implemented.');
}



