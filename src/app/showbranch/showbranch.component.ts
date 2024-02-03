import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BranchService } from '../service/branch.service';
import { Branch } from '../model/branch';
import { PassvalueService } from '../service/passvalue.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventsComponent } from '../add-events/events.component';

@Component({
  selector: 'app-showbranch',
  templateUrl: './showbranch.component.html',
  styleUrl: './showbranch.component.scss'
})
export class ShowbranchComponent implements OnInit,AfterViewInit {
  branchDto: Branch[]=[];
  branchId: number=0;
constructor(private branchService: BranchService, private passService: PassvalueService,private modalService: NgbModal,private ref:ChangeDetectorRef)
{

}
ngAfterViewInit(): void {
  setTimeout(()=>{
    this.passService.setformHeader('Shift');
  this.ref.detectChanges()
  }
  ,0)
  
}
ngOnInit() {
  this.loadMasterDatas();
  this.passService.getBranchId.subscribe(x=>this.branchId = x)
}
loadMasterDatas()
{
  this.branchService.getBranch().subscribe(res=>this.branchDto = res);
}


getBranchId(row)
{
  this.branchId = row.id
  this.passService.setBranchId(this.branchId);
  this.modalService.dismissAll();
  // this.modalService.open(EventsComponent,{
  //   size:'xl'
  //  })

}

}
