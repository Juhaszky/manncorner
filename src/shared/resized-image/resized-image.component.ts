import { Component, inject, Input, OnInit } from '@angular/core';
import { ImageService } from './image.service';

@Component({
    standalone: true,
    selector: 'resized-image',
    imports: [],
    templateUrl: './resized-image.component.html',
    styleUrl: './resized-image.component.scss'
})
export class ResizedImageComponent implements OnInit {
  @Input() imageUrl!: string;
  resizedImageUrl = '';
  imageService = inject(ImageService);
  ngOnInit(): void {
    this.resizedImageUrl = this.imageService.getResizedImageUrl(this.imageUrl);
  }
}
