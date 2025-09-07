import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../../../../shared/models/comment.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-comment',
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
  http = inject(HttpClient);

  @Output() replyEmitter = new EventEmitter<{replyText: string, parentCommentId: number}>();
  @Input() comment!: Comment;
  showReplyForm = false;
  replyText = '';
  toggleReplyForm() {
    this.showReplyForm = !this.showReplyForm;
    if (!this.showReplyForm) this.replyText = '';
  }

  submitReply() {
    if (!this.replyText.trim()) return;
    const newReply: Comment = {
      id: Date.now(),
      tradeId: this.comment.tradeId,
      userId: 1,
      commentData: this.replyText,
      createdAt: new Date(),
      owner: {
      } as any,
      parentCommentId: this.comment.id,
      replies: [],
    };
    this.replyEmitter.emit({replyText: this.replyText, parentCommentId: this.comment.id})
    this.toggleReplyForm();
  }
}
