import { Address } from "./address";
import { CompanyAdmin } from "./company-admin";
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
