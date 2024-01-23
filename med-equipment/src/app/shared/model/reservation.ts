import { Equipment } from "./equipment";

export interface Reservation {
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