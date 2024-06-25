import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }
  
  getResizedImageUrl(imageUrl: string): string {
    return `http://localhost:3000/image/resize?url=${imageUrl}`
  }
}
