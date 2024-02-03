
import { Branch } from "./branch"
import { Customer } from "./customer"
import { Payment } from "./payment"
import { Services } from "./services"
import { Therapist } from "./therapist"
import { Users } from "./users"

export class Transaction{
id:number
branchId:number
tdate:Date
invoiceNumber : string
therapistId : number
roomNumber : string
phone :number
serviceId :number
price :number
vat : number
municipalTax : number
qty : number
totalCost : number
tips : number
paymentId : number
customerStatus : string
refund : number
userId : number
receptionistId:number
isDeleted : boolean
bookingId:number

transactionTime:Date

branch:Branch
payment:Payment
service:Services
therapist:Therapist
users:Users
}
