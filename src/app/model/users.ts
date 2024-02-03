import { Role } from "./role"
import { Transaction } from "./transaction"
import { UserBranch } from "./userbranch"

export class Users {
   id:number
  firstName:string
  lastName:string
  gender:string
  address:string
  city:string
  phone:string
  email:string
  username: string
  password: string
  roleId:number
  isDeleted:boolean
  roles:Role
  userBranches:UserBranch[]

}
export class usersList{
id:number
name:string
}
