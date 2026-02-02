import { Property } from './property';
import { Province } from './province';
import { Town } from './town';

export interface ProvincesResponse {
  provinces: Province[];
}
export interface TownsResponse {
  towns: Town[];
}
export interface PropertiesResponse {
  properties: Property[];
  /*   total: number;
  page: number;
  more: boolean; */
}
export interface SinglePropertyResponse {
  property: Property;
}
