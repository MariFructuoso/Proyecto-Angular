import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'top-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenu {
}
