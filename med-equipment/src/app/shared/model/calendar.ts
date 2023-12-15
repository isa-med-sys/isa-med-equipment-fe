import { Company } from "./company";
import { TimeSlot } from "./timeslot";

export interface Calendar {
  id: number;
  company: Company;
  workStartTime: number[];
  workEndTime: number[];
  worksOnWeekends: boolean;
  timeSlots: TimeSlot[];
}