import { Shift } from "./shift"
import { Therapist } from "./therapist"

export class TherapistShift{
    id:number
    therapistId:number
    shiftId:number

    shift:Shift[]
    therapist:Therapist
}

export class SelectedTherapistShift{
    id:number;
    therapistId:number
    shiftId:number
   
}