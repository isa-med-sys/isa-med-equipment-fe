import { CompanyAdmin } from "./company-admin";

export interface TimeSlot {
  id: number;
  admin: CompanyAdmin;
  start: number[];
  duration: number;
  isFree: boolean;
}