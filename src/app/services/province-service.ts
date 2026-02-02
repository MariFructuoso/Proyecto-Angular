import { httpResource } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { ProvincesResponse, TownsResponse } from '../properties/interface/response';

@Injectable({
  providedIn: 'root',
})
export class ProvinceService {
  // Resource compartido para la aplicación
  readonly provincesResource = httpResource<ProvincesResponse>(() => `provinces`, {
    defaultValue: { provinces: [] },
  });

  getTownsResource(id: Signal<string>) {
    return httpResource<TownsResponse>(() => (id() ? `provinces/${id()}/towns` : undefined), {
      defaultValue: { towns: [] },
    });
  }
}
