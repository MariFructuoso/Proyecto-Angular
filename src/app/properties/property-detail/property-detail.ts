import { ChangeDetectionStrategy, Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { PropertiesService } from '../../services/properties-service';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { Property } from '../interface/property';
import { CurrencyPipe } from '@angular/common';

import { MortgageCalculator } from '../mortgage-calculator/mortgage-calculator';
import { PropertyComments } from '../property-comments/property-comments';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'property-detail',
  imports: [
    RouterLink, 
    CurrencyPipe, 
    MortgageCalculator, 
    PropertyComments, 
    SafeUrlPipe
  ],
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

  mapUrl = computed(() => {
    const p = this.property();
    if (!p) return '';
    return `https://maps.google.com/maps?q=${p.town.latitude},${p.town.longitude}&z=15&output=embed`;  });

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
