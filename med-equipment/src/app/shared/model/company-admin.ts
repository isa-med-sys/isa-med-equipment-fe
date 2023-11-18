import { Address } from "./address";
import { Company } from "./company";

export interface CompanyAdmin {
    id: number;
    email: string;
    name: string;
    surname: string;
    password: string;
    phoneNumber: string;
    address: Address; //
    companyId: number; //rdd
}

