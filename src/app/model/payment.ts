import { Transaction } from "./transaction"

export class Payment{
  id:number
  name:string
  isApproved:boolean
  isDeleted:boolean
  transaction:Transaction[]
}
