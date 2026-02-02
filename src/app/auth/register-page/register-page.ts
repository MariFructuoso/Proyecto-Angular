import { ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'register-page',
  imports: [],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grow flex items-center justify-center'
  },
})
export class RegisterPage {
  #router = inject(Router);
  register() {
    this.#router.navigate(['/auth/login']);
  }
}
