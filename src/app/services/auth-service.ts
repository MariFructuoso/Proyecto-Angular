// src/app/services/auth-service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRegister } from '../auth/interface/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #http = inject(HttpClient);
  #authUrl = 'auth'; // Base URL del endpoint

  register(user: UserRegister): Observable<UserRegister> {
    return this.#http.post<UserRegister>(`${this.#authUrl}/register`, user);
  }
}