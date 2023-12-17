import { Company } from "./company";
import { EquipmentType } from "./equipment-type.enum";

export interface Equipment {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  type: EquipmentType;
  companies: Company[];
  quantity: number;
}
