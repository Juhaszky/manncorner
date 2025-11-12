import { inject, Injectable } from '@angular/core';
import { Comment } from '../../../../shared/models/comment.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Item } from '../../../../shared/models/item.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  http = inject(HttpClient);

  makeComment(commentData: {
    tradeId: string;
    commentData: string;
    parentId?: number;
    itemsOffer: Item[]
  }): Observable<Comment> {
    return this.http.post<Comment>(`${environment.API_URL}/api/Comment`, commentData)
  }
}
