export interface Reservation {
    userId: number;
    companyId: number;
    equipmentIds: number[];
    timeSlotId: number;
    isPickedUp?: boolean;
    isCancelled?: boolean;
    qrCode?: string;
}