export interface Contract {
    id: number;
    hospitalName: string;
    startDate: Date;
    namedEquipmentQuantities: Map<string, number>;
}