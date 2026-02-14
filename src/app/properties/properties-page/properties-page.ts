import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { PropertiesResponse, Property } from '../interface/property';
import { PropertyCard } from '../property-card/property-card';
import { PropertiesService } from '../../services/properties-service';
import { ProvinceService } from '../../services/province-service';
import { ProfileService } from '../../services/profile.service'; 
import { debounce, form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'properties-page',
  imports: [PropertyCard, FormField],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesPage {
  page = signal(1);
  search = signal('');
  provinceFilter = signal('');

  sellerId = input<string>();
  sellerName = signal('');

  searchField = form(this.search, field => {
    debounce(field, 600);
  });
  provinceField = form(this.provinceFilter);

  readonly #propertiesService = inject(PropertiesService);
  #provinceService = inject(ProvinceService);
  #profileService = inject(ProfileService); 

  readonly provincesResource = this.#provinceService.provincesResource;
  
  // 3. Pasamos sellerId al servicio
  readonly propertiesResource = this.#propertiesService.getProperties(
    this.page, 
    this.search, 
    this.provinceFilter,
    this.sellerId // Nuevo parámetro
  );
  
  properties = linkedSignal<PropertiesResponse | undefined, Property[]>({
    source: () => this.propertiesResource.value(),
    computation: (resp, previous) => {
      if (!resp) return previous?.value ?? [];
      if (this.page() === 1) return resp.properties;
      return previous ? previous.value.concat(resp.properties) : resp.properties;
    }
  });

  constructor() {
    effect(() => {
      const id = this.sellerId();
      if (id) {
        this.#profileService.getProfile(+id).subscribe(u => {
          this.sellerName.set(u.name);
        });
      } else {
        this.sellerName.set('');
      }
    });
  }

  addProperty(property: Property) {
    this.properties.update((properties) => [...properties, property]);
  }

  deleteProperty(property: Property) {
    this.properties.update((properties) => properties.filter((p) => p !== property));
  }

  filtrado() {
    let text = '';
    if (!this.search() && !this.provinceFilter() && !this.sellerId()) {
      return 'No filters applied';
    }
    
    if (this.sellerId()) text += `Seller: ${this.sellerName()}. `;
    if (this.provinceFilter()) text += `Province: ${this.provinceFilter()}. `; 
    if (this.search()) text += `Search: ${this.search()}.`;
    
    return text;
  }
}