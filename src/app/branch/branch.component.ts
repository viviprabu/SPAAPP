import { Branch } from './../model/branch';
import { Country } from './../model/country';
import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BranchService } from '../service/branch.service';
import { CountryService } from '../service/country.service';
import Swal from 'sweetalert2';
import { empty, isEmpty } from 'rxjs';
import { PassvalueService } from '../service/passvalue.service';
import { Currency } from '../model/currency';
import { CurrencyService } from '../service/currency.service';
import { Company } from '../model/company';
import { CompanyService } from '../service/company.service';
import { formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit, AfterViewInit,AfterContentChecked
{
  searchTerm: string = "";
  formBname:string="";
  formCname:number = 0;
  searchDto : Branch[]=[];
  isSubmit: boolean = false;
  //isSearch:boolean = false;
  isActiveValue:boolean = false;
  isModify : boolean = false;
  isChecked: boolean = false;
  branchFormGroup : FormGroup;
  searchFormGroup: FormGroup;
  branchDto: Branch[]=[];
  branchDtl: Branch[]=[];
  countryDto:Country[]=[];
  countryDtl: any;
  branchId : number = 0;
  isCheckedMap:boolean = false;
  companyDto : Company[]=[];
  formHeader:string=""
  branchPageDto:Branch[]=[];
  page=1;
  pageSize=15;

  constructor(private formbuilder: FormBuilder, private branchService: BranchService, private companyService: CompanyService,
    private countryService: CountryService,private passService: PassvalueService, private modalService: NgbModal,private ref: ChangeDetectorRef)
  {
 
   
    this.branchFormGroup = this.formbuilder.group({
      id:[0],
      name:["", Validators.required],
      countryId:[""],
      isActive:[true],
      companyId:[0,Validators.required],
      openingTime:["",Validators.required],
      closingTime:["",Validators.required],

      

    });
    this.searchFormGroup = this.formbuilder.group({
      id:[0],
      name:["", Validators.required],
      countryId:[""],
      isActive:[true],
      companyId:[0,Validators.required],
      openingTime:["",Validators.required],
      closingTime:["",Validators.required],


    })
  }
 ngAfterContentChecked(): void {
    this.refreshPages()
  }
  
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.passService.setformHeader("Branch");
      
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
    this.branchService.getBranch().subscribe(res=>{this.branchDto = res;this.searchDto = res})
      this.companyService.getCompany().subscribe(res=>this.companyDto = res)
      this.countryService.getCountry().subscribe(ctres=>this.countryDto = ctres)
    }
  refreshPages()
  {
    this.branchPageDto = this.branchDto.map((slots, i) => ({ id: i + 1, ...slots })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
  }


  saveBranch()
  {
    
    if(this.branchFormGroup.valid)
    {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        
        if (result.isConfirmed) {
          this.branchService.createBranch(this.branchFormGroup.value).subscribe((res:any) => {
            // //console.log(res.value);

            this.branchDto.push(res.value);
            this.branchFormGroup.reset();
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
  getRecords(br:Branch)
  {

    this.branchFormGroup.controls['id'].setValue(br.id);
    // this.branchId = br.id;
    // //console.log(br.id);
    this.branchFormGroup.controls['name'].setValue(br.name);
    this.branchFormGroup.controls['countryId'].setValue(br.countryId);
    this.branchFormGroup.controls['companyId'].setValue(br.companyId);
    let now3 = new Date(br.openingTime);
    let hours3 = ("0"+ now3.getHours()).slice(-2);
    let minutes3 = ("0"+ now3.getMinutes()).slice(-2);
    let str3 = hours3 + ":" + minutes3;
    this.branchFormGroup.controls['openingTime'].setValue(str3)
    let now4 = new Date(br.closingTime);
    let hours4 = ("0"+ now4.getHours()).slice(-2);
    let minutes4 = ("0"+ now4.getMinutes()).slice(-2);
    let str4 = hours4 + ":" + minutes4;
    this.branchFormGroup.controls['closingTime'].setValue(str4);

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
        this.branchService.updateBranch(this.branchFormGroup.value).subscribe(res=>{
          //console.log(res);
          location.reload()
          this.branchFormGroup.reset();
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
    this.branchFormGroup.controls['id'].setValue(0);
    this.branchFormGroup.controls['isActive'].setValue(true);
  }

deleteBranch(br:Branch)
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
      this.branchService.deleteBranch(br).subscribe(res=>{
        //console.log(res)
        //this.getEmployee();

        this.branchDto.splice(this.branchDto.findIndex(x=>x.id == br.id), 1);
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
  this.branchFormGroup.reset();
}

searchBranch()
{

  this.formBname = this.searchFormGroup.controls['name'].value;
  this.formCname = this.searchFormGroup.controls['countryId'].value;

  if(this.formBname != '')
  {
    this.searchDto = this.branchDto.filter((element)=>
      {return element.name.toLowerCase() == this.formBname.toLowerCase()})
      //this.isSearch = true;
  }
  else{
    Swal.fire("Please enter Branch Name to search?");
  }
}
onSelectionChange(e)
{
  this.formBname = this.searchFormGroup.controls['name'].value;

  if(this.formBname == '')
  {
    this.searchDto = this.branchDto.filter((element)=>{
      return element.countryId == e.target.value })
      //this.isSearch = true;
  }
  else
  {
    this.searchDto = this.branchDto.filter((element)=>{
      return element.countryId == e.target.value && element.name.toLowerCase() == this.formBname.toLowerCase() })
      //this.isSearch = true;
  }


}
cancelSearch()
{
location.reload();
}
deleteRows()
{
  
}
addNew()
{
  this.isModify = false;
  this.branchFormGroup.reset();
  this.branchFormGroup.controls['isActive'].setValue(true);
  this.branchFormGroup.controls['id'].setValue(0);
  
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

