import { Province } from './province';

export interface Town {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  province: Province;
}
