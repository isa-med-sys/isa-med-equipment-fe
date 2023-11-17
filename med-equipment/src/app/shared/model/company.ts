import { Address } from "./address";

export interface Company{
  id: number;
  name: string;
  rating: number;
  address: Address;
  //equipment: Equipment[];
}
