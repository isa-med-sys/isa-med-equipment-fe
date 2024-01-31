import { Equipment } from "./equipment";

export interface Reservation {
    id?: number; //
    userId: number;
    companyId: number;
    equipmentIds: number[];
    timeSlotId: number;
    isPickedUp?: boolean;
    isCancelled?: boolean;
    qrCode?: string;
    price?: number;
    companyName?: string;
    start?: string;
}