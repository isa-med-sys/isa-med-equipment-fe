import { CompanyAdmin } from "./company-admin";

export interface TimeSlot {
    id: number;
    admin: CompanyAdmin;
    companyAdminId?: number;
    start: TimeSlotStart;
    duration: number;
    isFree: boolean;
}

export type TimeSlotStart = [number, number, number, number, number];
