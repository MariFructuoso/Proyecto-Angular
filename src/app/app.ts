import { Component, signal } from '@angular/core';
import { TopMenu } from './shared/top-menu/top-menu';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, TopMenu],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Inmosanvi');
}
