import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'login-page',
  imports: [],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grow flex items-center justify-center'
  },
})
export class LoginPage {
  #router = inject(Router);
  login() {
    this.#router.navigate(['/properties']);
  }
}
