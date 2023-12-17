import { Time } from "@angular/common";
import { Address } from "./address";
import { CompanyAdmin } from "./company-admin";
import { Equipment } from "./equipment";

export interface CompanyCalendar {
  id: number;
  name: string;
  description: string;
  rating: number;
  address: Address;
  equipment: Equipment[];
  admins: CompanyAdmin[];

  workStartTime: Time;
  workEndTime: Time;
  worksOnWeekends: boolean;
}