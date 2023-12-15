import { Address } from "./address";

export interface RegisteredUser {
    id: number;
    email: string;
    name: string;
    surname: string;
    currentPassword: string;
    newPassword: string;
    phoneNumber: string;
    occupation: string;
    companyInfo: string;
    address: Address;
    penaltyPoints: number
}