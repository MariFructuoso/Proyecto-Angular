import { inject, Injectable, Signal } from '@angular/core';
import { Property, PropertyInsert } from '../properties/interface/property';
import { PropertiesResponse, SinglePropertyResponse } from '../properties/interface/response';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  #propertiesUrl = 'properties';
  #http = inject(HttpClient);
  // Resource compartido para la aplicación
  readonly propertiesResource = httpResource<PropertiesResponse>(() => `properties`, {
    defaultValue: { properties: [] },
  });

  getPropertytIdResource(id: Signal<number>) {
    return httpResource<SinglePropertyResponse>(
      () => (id() ? `properties/${id()}` : undefined), // Cuando es undefined no lanza petición http
    );
  }

  addProperty(property: PropertyInsert): Observable<Property> {
    return this.#http.post<SinglePropertyResponse>(this.#propertiesUrl, property).pipe(
      map((resp: SinglePropertyResponse) => resp.property),
      tap(() => this.propertiesResource.reload()),
    );
  }

  deleteProperty(id: number): Observable<void> {
    return this.#http
      .delete<void>(`${this.#propertiesUrl}/${id}`)
      .pipe(tap(() => this.propertiesResource.reload()));
  }
}
