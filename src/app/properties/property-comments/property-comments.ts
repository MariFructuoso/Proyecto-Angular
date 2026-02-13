import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { StarRating } from '../star-rating/star-rating';
import { FormsModule } from '@angular/forms';
import { Comment } from '../interface/comment';
import { PropertiesService } from '../../services/properties-service'; // Importamos el servicio
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'property-comments',
    standalone: true,
    imports: [StarRating, FormsModule],
    templateUrl: './property-comments.html',
    styleUrl: './property-comments.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyComments implements OnInit {
    propertyId = input.required<number>();
    
    #propertiesService = inject(PropertiesService);
    #destroyRef = inject(DestroyRef);

    comments = signal<Comment[]>([]);
    newRating = signal(0);
    newComment = signal('');

    ngOnInit() {
        this.loadComments();
    }

    loadComments() {
        this.#propertiesService.getComments(this.propertyId())
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe({
                next: (data) => this.comments.set(data),
                error: (err) => console.error("Error cargando comentarios", err)
            });
    }

    addComment() {
        if (!this.newComment().trim() || this.newRating() === 0) return;

        this.#propertiesService.postComment(this.propertyId(), this.newComment(), this.newRating())
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe({
                next: (savedComment) => {
                    this.comments.update(prev => [savedComment, ...prev]);
                    this.newRating.set(0);
                    this.newComment.set('');
                },
                error: (err) => console.error("Error guardando comentario", err)
            });
    }
}