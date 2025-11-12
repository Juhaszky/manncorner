import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ImageService } from './image.service';

@Component({
    standalone: true,
    selector: 'resized-image',
    imports: [],
    templateUrl: './resized-image.component.html',
    styleUrl: './resized-image.component.scss'
})
export class ResizedImageComponent implements OnInit, OnChanges {
  @Input() imageUrl!: string;
  resizedImageUrl = '';
  imageService = inject(ImageService);
  ngOnInit(): void {
    this.resizedImageUrl = this.imageService.getResizedImageUrl(this.imageUrl);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrl'] && changes['imageUrl'].currentValue) {
      this.resizedImageUrl = this.imageService.getResizedImageUrl(changes['imageUrl'].currentValue);
    }
  }
}
