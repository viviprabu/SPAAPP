import { Currency } from "./currency"

export class Company{
    id:number
    name:string
    currencyId:number
    alternateCurrencyId:number
    currencyCode:string
    conversionRate:number
    isActive:boolean

    currency: Currency
}