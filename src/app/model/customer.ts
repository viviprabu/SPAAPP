import { Transaction } from "./transaction"

export class Customer{

  id:number
  name:string
  gender:string
  address:string
  phone:string
  city:number
  isDeleted:boolean
  transaction:Transaction[]
}
