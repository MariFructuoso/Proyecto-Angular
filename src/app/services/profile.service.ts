import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../auth/interface/user'; 
import { UserResponse } from '../auth/interface/user-response'; 

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  #http = inject(HttpClient);
  #usersUrl = 'users';

  getProfile(id?: number): Observable<User> {
    const url = id ? `${this.#usersUrl}/${id}` : `${this.#usersUrl}/me`;
    return this.#http.get<UserResponse>(url).pipe(
      map(resp => resp.user)
    );
  }

  saveProfile(name: string, email: string): Observable<User> {
    return this.#http.put<UserResponse>(`${this.#usersUrl}/me`, { name, email }).pipe(
      map(resp => resp.user)
    );
  }

  saveAvatar(avatar: string): Observable<User> {
    return this.#http.put<UserResponse>(`${this.#usersUrl}/me/photo`, { avatar }).pipe(
      map(resp => resp.user)
    );
  }

  savePassword(password: string): Observable<void> {
    return this.#http.put<void>(`${this.#usersUrl}/me/password`, { password });
  }
}