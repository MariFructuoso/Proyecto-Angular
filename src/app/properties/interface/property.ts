import { Town } from './town';

export interface PropertyInsert {
  address: string;
  title: string;
  description: string;
  price: number;
  sqmeters: number;
  numRooms: number;
  numBaths: number;
  mainPhoto: string;
  townId: number;
}

export interface Property extends Omit<PropertyInsert, 'townId'> {
  id: number;
  town: Town;
  createdAt: string;
  status: string;
  mine?: boolean;
}

export interface PropertiesResponse {
  properties: Property[];
}

export interface SinglePropertyResponse {
  property: Property;
}
