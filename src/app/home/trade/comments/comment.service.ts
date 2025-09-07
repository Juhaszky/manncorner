import { inject, Injectable } from '@angular/core';
import { Comment } from '../../../../shared/models/comment.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  http = inject(HttpClient);

  makeComment(commentData: {
    tradeId: string;
    commentData: string;
    parentId?: number;
  }) {
    this.http
      .post<Comment[]>(`${environment.API_URL}/api/Comment`, commentData)
      .subscribe(res => {
        console.log(res);
      });
  }
}
