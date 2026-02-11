import { ChangeDetectionStrategy, Component, inject, input, signal, OnInit } from '@angular/core';
import { StarRating } from '../star-rating/star-rating';
import { FormsModule } from '@angular/forms';
import { Comment } from '../interface/comment';
import { PropertiesService } from '../../services/properties-service';

@Component({
  selector: 'property-comments',
  standalone: true,
  imports: [StarRating, FormsModule],
  templateUrl: './property-comments.html',
  styleUrl: './property-comments.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyComments implements OnInit {
  propertiesService = inject(PropertiesService);
  propertyId = input.required<number>();

  comments = signal<Comment[]>([]);

  newRating = signal(0);
  newComment = signal('');

  ngOnInit() {
    this.propertiesService.getComments(this.propertyId()).subscribe({
      next: (serverComments) => {
        this.comments.set(serverComments);
      },
      error: (e) => console.error('Error cargando comentarios:', e)
    });
  }

  addComment() {
    if (!this.newComment().trim() || this.newRating() === 0) return;

    this.propertiesService.postComment(
      this.propertyId(),
      this.newComment(),
      this.newRating()
    ).subscribe({
      next: (savedComment) => {
        this.comments.update(prev => [savedComment, ...prev]);

        this.newRating.set(0);
        this.newComment.set('');
      },
      error: (e) => console.error('Error guardando comentario:', e)
    });
  }
}