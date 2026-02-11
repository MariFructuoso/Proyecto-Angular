import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'property-comments',
  standalone: true,
  imports: [],
  templateUrl: './property-comments.html',
  styleUrl: './property-comments.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyComments {
  propertyId = input.required<number>();
}