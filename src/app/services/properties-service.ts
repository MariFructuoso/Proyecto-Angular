import { inject, Injectable, Signal } from '@angular/core';
import { Property, PropertyInsert } from '../properties/interface/property';
import { PropertiesResponse, SinglePropertyResponse } from '../properties/interface/response';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Comment } from '../properties/interface/comment';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  #propertiesUrl = 'properties'; 
  #http = inject(HttpClient);

  getProperties(page: Signal<number>, search: Signal<string>, province: Signal<string>) {
    return httpResource<PropertiesResponse>(() => {
      const params = new URLSearchParams();
      params.set('page', page().toString());
      if (search()) params.set('search', search()); 
      if (province()) params.set('province', province()); 
      return `properties?${params.toString()}`;
    }, {
      defaultValue: { properties: [] }
    });
  }
  
  getPropertytIdResource(id: Signal<number>) {
    return httpResource<SinglePropertyResponse>(
      () => (id() ? `properties/${id()}` : undefined),
    );
  }

  addProperty(property: PropertyInsert): Observable<Property> {
    return this.#http.post<SinglePropertyResponse>(this.#propertiesUrl, property).pipe(
      map((resp: SinglePropertyResponse) => resp.property),
    );
  }

  deleteProperty(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#propertiesUrl}/${id}`);
  }

  getComments(propertyId: number): Observable<Comment[]> {
    return this.#http.get<Comment[]>(`${this.#propertiesUrl}/${propertyId}/ratings`);
  }

  postComment(propertyId: number, comment: string, rating: number): Observable<Comment> {
    const payload = {
        rating: rating,
        comment: comment
    };
    return this.#http.post<Comment>(`${this.#propertiesUrl}/${propertyId}/ratings`, payload);
  }

  getProperty(id: number): Observable<Property> {
    return this.#http.get<SinglePropertyResponse>(`${this.#propertiesUrl}/${id}`).pipe(
      map((resp) => resp.property)
    );
  }

  saveProperty(property: Property): Observable<Property> {
    return this.#http.put<SinglePropertyResponse>(`${this.#propertiesUrl}/${property.id}`, property).pipe(
      map((resp) => resp.property)
    );
  }
}