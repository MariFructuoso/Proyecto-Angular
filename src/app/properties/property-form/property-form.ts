import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, max, min, minLength, pattern, required, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { PropertiesService } from '../../services/properties-service';
import { ProvinceService } from '../../services/province-service';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64-directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page-guard';
import { OlMap } from '../ol-maps/ol-map';
import { OlMarker } from '../ol-maps/ol-marker';
import { Property } from '../interface/property';

@Component({
  selector: 'property-form',
  standalone: true,
  imports: [EncodeBase64Directive, FormField, OlMap, OlMarker],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyForm implements CanComponentDeactivate, OnInit {
  filename = '';
  saved = false;

  id = input.required({ transform: (v: string | undefined) => Number(v ?? 0) });
  
  coordinates = signal<[number, number]>([-0.5, 38.5]);

  #propertiesService = inject(PropertiesService);
  #provinceService = inject(ProvinceService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  newProperty = signal({
    title: '',
    description: '',
    townId: '0',
    address: '',
    price: 0,
    numBaths: 0,
    sqmeters: 0,
    numRooms: 0,
    mainPhoto: '',
  });

  newPropertyForm = form(this.newProperty, (schema) => {
    required(schema.title, { message: 'You must enter a title' });
    required(schema.description, { message: 'You must enter a description' });
    required(schema.townId, { message: 'You must choose a town' });
    required(schema.address, { message: 'You must enter an address' });
    required(schema.price, { message: 'You must enter a price' });
    required(schema.numBaths, { message: 'You must enter the number of bathrooms' });
    required(schema.sqmeters, { message: 'You must enter the number of square meters' });
    required(schema.numRooms, { message: 'You must enter the number of rooms' });
    
    pattern(schema.townId, /^[1-9]\d*$/, { message: 'You must choose a town' });
    pattern(schema.title, /^[a-zA-Z][a-zA-Z ]*$/, { message: 'You must enter a valid title' });
    minLength(schema.title, 5, {
      message: (context) =>
        `You must enter at least ${5 - context.value().length} characters more`,
    });
    min(schema.price, 1, { message: 'Price must be greater than 0' });
    min(schema.sqmeters, 1, { message: 'Square meters must be greater than 0' });
    min(schema.numBaths, 1, { message: 'Bathrooms must be greater than 0' });
    min(schema.numRooms, 1, { message: 'Rooms must be greater than 0' });
    max(schema.numBaths, 20, { message: 'Bathrooms must be less than 20' });
    max(schema.numRooms, 20, { message: 'Rooms must be less than 20' });
  });

  provinceIdField = form(signal('0'), (field) => {
    required(field, { message: 'You must choose a province' });
    pattern(field, /^[1-9]\d*$/, { message: 'You must choose a province' });
  });

  imageField = form(signal(''), (field) => {
    validate(field, ({ value }) => {
      if (this.id() === 0 && !value()) {
        return {
          kind: 'required',
          message: 'You must choose an image file',
        };
      }
      return null;
    });
  });

  readonly provincesResource = this.#provinceService.provincesResource;
  readonly townsResource = this.#provinceService.getTownsResource(this.provinceIdField().value);

  constructor() {

    effect(() => {
      const selectedTownId = this.newPropertyForm.townId().value();
      const towns = this.townsResource.value()?.towns;

      if (towns && selectedTownId !== '0') {
        const town = towns.find(t => t.id === +selectedTownId);
        if (town && town.latitude && town.longitude) {
          this.coordinates.set([town.longitude, town.latitude]);
        }
      }
    });

    effect(() => {
      const id = this.id();
      if (id > 0) {
        this.#propertiesService.getProperty(id).subscribe((p) => {
          this.newProperty.set({
            title: p.title,
            description: p.description,
            price: p.price,
            address: p.address,
            townId: p.town.id.toString(),
            sqmeters: p.sqmeters,
            numRooms: p.numRooms,
            numBaths: p.numBaths,
            mainPhoto: p.mainPhoto
          });

          this.provinceIdField().setControlValue(p.town.province.id.toString()); 
          
          if (p.town.latitude && p.town.longitude) {
            this.coordinates.set([p.town.longitude, p.town.latitude]);
          }
        });
      }
    });
  }

  ngOnInit() {
    if (this.id() === 0 && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.coordinates.set([position.coords.longitude, position.coords.latitude]);
      });
    }
  }

  addProperty(event: Event) {
    event.preventDefault();
    if (this.newPropertyForm().valid()) {
      const propertyData = { ...this.newProperty(), townId: +this.newProperty().townId };

      let request$;

      if (this.id() > 0) {
        request$ = this.#propertiesService.saveProperty({ 
            ...propertyData, 
            id: this.id() 
        } as unknown as Property); 
      } else {
        request$ = this.#propertiesService.addProperty(propertyData);
      }

      request$.pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => {
          this.saved = true;
          this.#router.navigate(['/properties']);
        });
    }
  } 

  canDeactivate() {
    return this.saved || !this.newPropertyForm().dirty() || confirm('¿Quieres abandonar la página?');
  }
}