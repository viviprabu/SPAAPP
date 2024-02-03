import { UserBranch } from './userbranch';
import { Country } from './country';
import { Transaction } from './transaction';
import { Currency } from './currency';
import { Company } from './company';
import { Time } from '@angular/common';
import { Therapist } from './therapist';
export class Branch{
id:number
name:string
countryId:number
createdOn: string
companyId:number
openingTime:Date
closingTime:Date
isActive: boolean
isChecked: boolean;

company:Company[]


transaction:Transaction[]
  check: boolean;
  checked: boolean;
  


}

export class BranchList{
  id:number
  name:string
  checked: boolean
  isActive:boolean
  
}
