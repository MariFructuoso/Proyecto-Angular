import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, required, email } from "@angular/forms/signals";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../services/auth-service'; 
import { UserLogin } from '../interface/user'; 

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [FormField, RouterLink], 
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