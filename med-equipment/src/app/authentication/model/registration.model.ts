import { Address } from "./address.model"

export interface Registration {
    name: string,
    surname: string,
    email: string,
    occupation: string,
    phoneNumber: string,
    companyInfo: string
    password: string
    address: Address
}