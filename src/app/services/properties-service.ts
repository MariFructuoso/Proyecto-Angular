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
  #commentsUrl = 'comments';     
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

  getComments(id: number): Observable<Comment[]> {
    return this.#http.get<Comment[]>(`${this.#commentsUrl}?propertyId=${id}`);
  }

  postComment(id: number, text: string, rating: number): Observable<Comment> {
    const newComment = {
        propertyId: id,
        description: text, 
        rating: rating,
        user: "User", 
        date: new Date().toISOString()
    };
    return this.#http.post<Comment>(this.#commentsUrl, newComment);
  }
}