import { Component, input, model, signal, effect } from '@angular/core';

@Component({
  selector: 'star-rating',
  standalone: true,
  imports: [],
  templateUrl: './star-rating.html', 
  styleUrl: './star-rating.css'
})
export class StarRating {
  rating = model.required<number>(); 
  
  size = input<'small' | 'big'>('small');
  readonly = input(false);                

  auxRating = signal(0);

  constructor() {
    effect(() => {
      this.auxRating.set(this.rating());
    });
  }
}