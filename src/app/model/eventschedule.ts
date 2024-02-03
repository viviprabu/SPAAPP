import { Time } from "@angular/common"
import { Branch } from "./branch"
import { Therapist } from "./therapist"

export class EventSchedule{
    id:number
    name:string
    gender:string
    phone:string
    eventTitle:string
    serviceId:number
    scheduleDate:Date
    startTime:Date
    endTime:Date
    isClosed:boolean
    isActive:boolean
    branchId:number
    therapistId:number
    availableTime:Date
    checked:boolean
    userId:number
    
    events:Event

}

// export class EventInput{
//     id:number
//     title:

   
// }


