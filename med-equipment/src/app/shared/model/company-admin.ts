import { Address } from "./address";
import { Company } from "./company";

export interface CompanyAdmin {
  id: number;
  name: string;
  surname: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  phoneNumber: string;
  address: Address;
  company: Company;
}