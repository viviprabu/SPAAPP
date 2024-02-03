import { content } from './../contentlayout/content';
import { formatDate } from '@angular/common';
import { TransactionService } from './../service/transaction.service';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgModule, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Transaction } from '../model/transaction';
import { PassvalueService } from '../service/passvalue.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserStoreService } from '../service/user-store.service';
import { AuthService } from '../service/auth.service';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdffonts from 'pdfmake/build/vfs_fonts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// (pdfmake as any).vfs  =  pdffonts.pdfMake.vfs;
// import htmlToPdfmake from 'html-to-pdfmake';
import jspdf from 'jspdf';
import { CompanyService } from '../service/company.service';
import { Company } from '../model/company';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit,AfterViewInit {

  @ViewChild('invoicePrint') invoicePrint:ElementRef;
  transDto : Transaction[]=[];
  invoiceDto:Transaction[]=[];
  invoice: string = "";
  invFormGroup: FormGroup;
  username: string="";
  role:string="";
  tableAdd:boolean= false;
  formHeader:string=""
  companyDto:Company[]=[]
  companyName:string=""
  userDto: import("d:/Applications/SpaApp/src/app/model/users").Users[];


constructor(private modalService: NgbModal,private transService: TransactionService,
  private passService: PassvalueService, private formBuilder: FormBuilder, private userStore: UserStoreService,
  private auth: AuthService,private ref: ChangeDetectorRef,private companyService:CompanyService)
{

  
this.passService.getInvoice.subscribe(res=>this.invoice = res);

this.invFormGroup = this.formBuilder.group({
  id:[0],
  branchId:[0],
  // tdate:[this.now],
  invoiceNumber : [""],
  therapistId : [0],
  tdate:[""],
  roomNumber : [""],
  userId : [0],
  phone :[""],
  serviceId :[0],
  price :[0],
  vat : [0],
  municipalTax : [0],
  qty : [0],
  totalCost : [0],
  tips : [0],
  paymentId : [0],
  customerStatus : [""],
  refund : [0],
  receptionistId : [0],
  paidTerms:[""],

      })

  this.getServiceForInvoice();

}
// ngOnChanges(changes: SimpleChanges): void {
//   this.ref.detectChanges()
// }
ngAfterViewInit(): void {
  setTimeout(()=>{
    
    this.passService.setformHeader("Invoice");
  this.ref.detectChanges()
  }
  ,0)
  
}
ngOnInit(): void {

  this.loadMasterDatas();
  
  this.getServiceForInvoice()
  this.invFormGroup.controls['invoiceNumber'].setValue(this.invoice);

}
loadMasterDatas()
{
  this.companyService.getCompany().subscribe(res=>{this.companyDto = res; this.companyDto.filter(x=>{this.companyName = x.name})})
  
}

close()
{
  this.modalService.dismissAll();
}

getServiceForInvoice()
{
  this.transService.getTransaction().subscribe(res=>{
      this.transDto = res
      this.invoiceDto = this.transDto.filter(result=>{
       return result.invoiceNumber === this.invFormGroup.controls['invoiceNumber'].value
      });
      this.invoiceDto.filter(inv=>{
        this.invFormGroup.controls['branchId'].setValue(inv.branch.name);
        this.auth.getUsersById(inv.userId).subscribe(res=>{
          this.userDto = res
          this.invFormGroup.controls['userId'].setValue(this.userDto[0].firstName +' '+ this.userDto[0].lastName)
        });
       
        this.invFormGroup.controls['phone'].setValue(inv.phone)
        this.invFormGroup.controls['roomNumber'].setValue(inv.roomNumber)
        this.invFormGroup.controls['tdate'].setValue(formatDate(inv.tdate,'dd-MM-yyyy','en'))
        this.invFormGroup.controls['paymentId'].setValue(inv.payment.name)
        this.invFormGroup.controls['paidTerms'].setValue('On Time Payment')
        this.invFormGroup.controls['totalCost'].setValue(inv.totalCost);

      })



  });
}
printInvoice()
{

  const doc = new jsPDF();
const content = this.invoicePrint.nativeElement;
html2canvas(content).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        // Few necessary setting options
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const doc = new jspdf('p', 'mm');
        let heightLeft = imgHeight;
        let position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        // Generated PDF
        doc.save(this.invoice+' '+this.invFormGroup.controls['userId'].value + '.pdf');
    });
    this.modalService.dismissAll();
}

}



