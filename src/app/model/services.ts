import { Transaction } from "./transaction"

export class Services{
  id:number
  name:string
  description:string
  price:number
  isActive:boolean
  isDeleted:boolean
  serviceTime:number
  transaction:Transaction[]
  checked: boolean
  ischecked: boolean
}
