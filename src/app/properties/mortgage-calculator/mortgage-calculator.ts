import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'mortgage-calculator',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './mortgage-calculator.html',
  styleUrl: './mortgage-calculator.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MortgageCalculator {
  price = input.required<number>();
  
  // Si cambia el precio, recalculamos la entrada al 20%
  downPayment = linkedSignal(() => this.price() * 0.2);
  
  years = signal(30);
  interest = signal(3.5);

  monthlyPayment = computed(() => {
    const p = this.price() - this.downPayment(); 
    const r = this.interest() / 100 / 12; 
    const n = this.years() * 12; 

    if (r === 0) return p / n; 
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  });
}