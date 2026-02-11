import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { PropertiesResponse, Property } from '../interface/property';
import { PropertyCard } from '../property-card/property-card';
import { PropertiesService } from '../../services/properties-service';
import { ProvinceService } from '../../services/province-service';
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

  searchField = form(this.search, field => {
    debounce(field, 600);
  });
  provinceField = form(this.provinceFilter);

  readonly #propertiesService = inject(PropertiesService); // Inyectamos el servicio
  #provinceService = inject(ProvinceService); // Injectamos el servicio

  readonly provincesResource = this.#provinceService.provincesResource;
  readonly propertiesResource = this.#propertiesService.getProperties(
    this.page, 
    this.search, 
    this.provinceFilter
  );
  
  properties = linkedSignal<PropertiesResponse | undefined, Property[]>({
    source: () => this.propertiesResource.value(),
    computation: (resp, previous) => {
      // Si el nuevo valor es undefined, devolvemos el anterior o array vacío
      if (!resp) return previous?.value ?? [];

      // Si la página es 1, devolvemos los datos nuevos (reseteamos la lista)
      if (this.page() === 1) return resp.properties;

      // Si es página > 1, concatenamos lo anterior con lo nuevo
      return previous ? previous.value.concat(resp.properties) : resp.properties;
    }
  });

  addProperty(property: Property) {
    this.properties.update((properties) => [...properties, property]);
  }

  deleteProperty(property: Property) {
    this.properties.update((properties) => properties.filter((p) => p !== property));
  }

  filtrado() {
    let text = '';
    if (!this.search() && !this.provinceFilter()) {
      text = 'No filters applied';
    } else {
      text += this.search() ? `Search: ${this.search()}` : '';
      text += this.provinceFilter() ? ` Province: ${this.provinceFilter()}` : '';
    }
    return text;
  }
}
