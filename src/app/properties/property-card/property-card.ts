import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { Property } from '../interface/property';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency-pipe';
import { PropertiesService } from '../../services/properties-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'property-card',
  imports: [IntlCurrencyPipe, RouterLink],
  templateUrl: './property-card.html',
  styleUrl: './property-card.css',
    host: {
    class: 'bg-white rounded-lg shadow-md flex flex-col relative overflow-visible',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyCard {
  property = input.required<Property>();
  deleted = output<void>();
  #propertiesService = inject(PropertiesService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  deleteProperty() {
    if (confirm('Are you going to delete this property')) {
      this.#propertiesService
        .deleteProperty(this.property().id!)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: () => {
            this.deleted.emit();
            this.#router.navigate(['/properties']);
          },
          error: (error) => {
            alert('Error al borrar el property');
            console.error(error);
          },
        });
    }
  }
}
