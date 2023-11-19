import { Address } from "./address";
import { Equipment } from "./equipment";
import {CompanyAdmin} from "./company-admin";

export interface Company {
  id: number;
  name: string;
  description: string;
  rating: number;
  address: Address;
  equipment: Equipment[];
  admins: CompanyAdmin[];
}
