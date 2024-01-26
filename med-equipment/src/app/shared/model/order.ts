import { Equipment } from "./equipment";

export interface Order {
    customer: string;
    id: number;
    equipment: string[];
    timeslotStart: TimeDate;
    timeslotEnd: TimeDate;
    isValid: boolean;
    isTaken: boolean;
    isCanaceled: boolean;
    isRightAdmin: boolean;
}

export type TimeDate = [number, number, number, number, number];
