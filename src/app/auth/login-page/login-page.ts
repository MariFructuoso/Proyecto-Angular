import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, required, email } from "@angular/forms/signals";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../services/auth-service'; 
import { UserLogin } from '../interface/user'; 
import { GoogleLogin } from '../google-login/google-login';
import { FbLogin } from '../fb-login/fb-login'; 

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [FormField, RouterLink, GoogleLogin, FbLogin], 
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grow flex items-center justify-center'
  },
})
export class LoginPage {
  #authService = inject(AuthService);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);

  loginData = signal({
    email: '',
    password: ''
  });

  loginForm = form(this.loginData, (schema) => {
    required(schema.email, { message: 'Email is required' });
    required(schema.password, { message: 'Password is required' });
    email(schema.email, { message: 'Invalid email format' });
  });

  // --- GOOGLE ---
  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
    this.#authService.loginGoogle(resp.credential)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          console.log('Login con Google correcto');
          this.#router.navigate(['/properties']);
        },
        error: (err) => console.error('Error en login de Google', err)
      });
  }

//FACEBOOK
  loggedFacebook(resp: fb.StatusResponse) {
    const token = resp.authResponse?.accessToken;

    if (token) {
      this.#authService.loginFacebook(token)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: () => {
            console.log('Login con Facebook correcto');
            this.#router.navigate(['/properties']);
          },
          error: (err: unknown) => console.error('Error en login de Facebook', err)
        });
    } else {
        console.error('No se recibió token de Facebook');
    }
  }

  showError(error: string) {
    console.error('Error:', error);
  }
  
//LOGIN NORMAL
  login(event: Event) {
    event.preventDefault();

    if (this.loginForm().valid()) {
      const credentials: UserLogin = this.loginData();

      this.#authService.login(credentials) 
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: () => { 
            console.log('Login correcto');
            this.#router.navigate(['/properties']);
          },
          error: (err) => { 
            console.error('Error en login', err);
          }
        });
    }
  }
}