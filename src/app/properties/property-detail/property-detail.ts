import { ChangeDetectionStrategy, Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { PropertiesService } from '../../services/properties-service';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { Property } from '../interface/property';
import { CurrencyPipe } from '@angular/common';

import { MortgageCalculator } from '../mortgage-calculator/mortgage-calculator';
import { PropertyComments } from '../property-comments/property-comments';

import { OlMapDirective } from '../../shared/directives/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-marker.directive';

import { StarRating } from '../star-rating/star-rating';

@Component({
  selector: 'property-detail',
  imports: [
    RouterLink,
    CurrencyPipe,
    MortgageCalculator,
    PropertyComments,
    OlMapDirective,    
    OlMarkerDirective,
    StarRating
  ],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyDetail {
  id = input.required({ transform: numberAttribute });
  #productsService = inject(PropertiesService);
  #title = inject(Title);
  #router = inject(Router);
  propertyResource = this.#productsService.getPropertytIdResource(this.id);
  property = computed(() => this.propertyResource.value()?.property);

  coordinates = computed<[number, number]>(() => {
    const p = this.property();
    if (!p) return [0, 0];
    return [p.town.longitude, p.town.latitude];
  });

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
