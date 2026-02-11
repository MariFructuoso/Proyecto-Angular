import {
  afterNextRender,
  afterRenderEffect,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { View, Map, Feature } from 'ol';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import { Geometry } from 'ol/geom';

@Directive({
  selector: '[olMap]',
  standalone: true,
  host: {
    style: 'display: block; position: relative;', 
  },
})
export class OlMapDirective {
  #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  coordinates = input.required<[number, number]>();
  zoom = input(16);

  #map!: Map;
  #view!: View;
  #vectorLayer!: VectorLayer<VectorSource>;

  get map() {
    return this.#map;
  }
  
  get view() {
    return this.#view;
  }

  get vectorLayer() {
    return this.#vectorLayer;
  }

  constructor() {
    afterNextRender(() => {
      useGeographic();

      this.#view = new View({
        center: this.coordinates(),
        zoom: this.zoom(),
      });

      this.#vectorLayer = new VectorLayer<VectorSource>({
        source: new VectorSource<Feature<Geometry>>({
          features: [],
        }),
      });

      this.#map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          this.#vectorLayer,
        ],
        target: this.#elementRef.nativeElement,
        view: this.#view,
      });
    });

    afterRenderEffect(() => {
      // Usamos ?. porque afterRenderEffect puede ejecutarse antes que afterNextRender
      this.#view?.setCenter(this.coordinates());
      this.#view?.setZoom(this.zoom());
    });
  }
}