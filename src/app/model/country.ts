import { Branch } from './branch';
export class Country
{
  id:number
  name:string
  isActive : boolean
  defaultCurrencyId:number
  alternateCurrencyId:number
  branchs:Branch[]

}

export class countryChecked{
  id:number
  
}