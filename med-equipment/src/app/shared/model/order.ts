export interface Order {
    customer: string;
    id: number;
    equipment: string[];
    timeslotStart: Date;
    timeslotEnd: Date;
    isValid: boolean;
}