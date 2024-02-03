import { Branch } from "./branch"
import { TherapistShift } from "./therapistShift"
import { Transaction } from "./transaction"

export class Therapist{
  id:number
  name:string
  branchId:number
  isAvailable:boolean
  isDeleted : boolean
  therapistShifts:TherapistShift[]
  branch:Branch
  checked: boolean
  ischecked: boolean
  
  
  
}
