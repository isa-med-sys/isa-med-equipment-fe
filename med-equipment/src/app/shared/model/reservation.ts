export interface Reservation {
    id?: number; //
    userId: number;
    companyId: number;
    equipmentIds: number[];
    timeSlotId: number;
    isPickedUp?: boolean;
    isCancelled?: boolean;
    qrCode?: string;
}