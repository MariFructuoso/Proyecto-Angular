import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, max, min, minLength, pattern, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { PropertiesService } from '../../services/properties-service';
import { ProvinceService } from '../../services/province-service';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64-directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page-guard';


@Component({
  selector: 'property-form',
  imports: [EncodeBase64Directive, FormField],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyForm implements CanComponentDeactivate {
  filename = '';
  saved = false;

  #propertiesService = inject(PropertiesService); // Injectamos el servicio
  #provinceService = inject(ProvinceService); // Injectamos el servicio
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  // Cuidado. Los valores asociados a <select> son de tipo string
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
    required(schema.mainPhoto,  { message: 'You must choose an image file' });
    pattern(schema.townId,  /^[1-9]\d*$/, { message: 'You must choose a town' }); // TownId es string
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

  // ProvinceId no está en el modelo que vamos a mandar, creamos formulario con 1 campo
  provinceIdField = form(signal('0'), (field) => {
    required(field, { message: 'You must choose a province' });
    pattern(field, /^[1-9]\d*$/, { message: 'You must choose a province' }); // provinceId es string
  });

  // El valor del input de imagen no está en el modelo, creamos formulario para validarlo
  imageField = form(signal(''), field => {
    required(field, { message: 'You must choose an image file' });
  });

  readonly provincesResource = this.#provinceService.provincesResource;
  readonly townsResource = this.#provinceService.getTownsResource(this.provinceIdField().value);

  constructor() {
    effect(() => {
      this.provinceIdField().value(); // Generamos dependencia cada vez que cambia la provincia
      untracked(() => this.newPropertyForm.townId().value.set('0')); // Reseteamos la id del pueblo
    });
  }


  // Este método cambia (no gestionamos la inserción en el array de productos)
  addProperty(event: Event) {
    event.preventDefault();
    this.#propertiesService
      .addProperty({...this.newProperty(), townId: +this.newProperty().townId})
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.saved = true;
        this.#router.navigate(['/properties']);
      });
  }

  canDeactivate() {
    return this.saved || !this.newPropertyForm().dirty() || confirm('¿Quieres abandonar la página?. Los cambios se perderán...');
  }
}
