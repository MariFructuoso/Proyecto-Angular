import { ChangeDetectionStrategy, Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { PropertiesService } from '../../services/properties-service';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { Property } from '../interface/property';
import { PropertyCard } from "../property-card/property-card";

@Component({
  selector: 'property-detail',
  imports: [PropertyCard, RouterLink],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyDetail {
  id = input.required({ transform: numberAttribute });
  #productsService = inject(PropertiesService);
  #title = inject(Title);
  propertyResource = this.#productsService.getPropertytIdResource(this.id);
  property = computed(() => this.propertyResource.value()?.property);
  #router = inject(Router);

  constructor() {
    effect(() => {
      if (this.propertyResource.hasValue()) this.#title.setTitle((this.property() as Property)?.title + ' | Angular Inmosanvi');
      if (this.propertyResource.error()) this.#router.navigate(['/properties']);
    });
  }

  goBack() {
    this.#router.navigate(['/properties']);
  }
}
