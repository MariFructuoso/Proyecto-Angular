import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'top-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenu {
  #authService = inject(AuthService);
  #router = inject(Router);

  logged = this.#authService.logged;

  logout() {
    this.#authService.logout();
    this.#router.navigate(['/properties']);  }
}