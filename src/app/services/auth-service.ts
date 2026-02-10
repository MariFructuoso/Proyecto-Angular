import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthResponse, UserLogin, UserRegister } from '../auth/interface/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    #http = inject(HttpClient);
    #authUrl = 'auth';
    #logged: WritableSignal<boolean> = signal(false);

    get logged() {
        return this.#logged.asReadonly();
    }

    register(user: UserRegister): Observable<UserRegister> {
        return this.#http.post<UserRegister>(`${this.#authUrl}/register`, user);
    }
    login(data: UserLogin): Observable<void> {
        return this.#http.post<AuthResponse>(`${this.#authUrl}/login`, data).pipe(
            map((response) => {
                localStorage.setItem('token', response.accessToken);
                this.#logged.set(true);
            })
        );
    }
    logout(): void {
        localStorage.removeItem('token');
        this.#logged.set(false);
    }

    isLogged(): Observable<boolean> {
        if (this.logged()) {
            return of(true);
        }
        const token = localStorage.getItem('token');
        if (!token) {
            return of(false);
        }

        return this.#http.get<void>(`${this.#authUrl}/validate`).pipe(map(() => {
            this.#logged.set(true);
            return true;
        }),
            catchError(() => {
                localStorage.removeItem('token');
                return of(false);
            })
        );

    }
    loginGoogle(token: string): Observable<void> {
        return this.#http.post<AuthResponse>(`${this.#authUrl}/google`, { token }).pipe(
            map((response) => {
                localStorage.setItem('token', response.accessToken);
                this.#logged.set(true);
            })
        );
    }

    loginFacebook(token: string): Observable<void> {
        return this.#http.post<AuthResponse>(`${this.#authUrl}/facebook`, { token }).pipe(
            map((response) => {
                localStorage.setItem('token', response.accessToken);
                this.#logged.set(true);
            })
        );
    }
}