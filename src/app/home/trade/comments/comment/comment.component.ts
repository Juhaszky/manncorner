import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../../../../shared/models/comment.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ItemContainerComponent } from '../../../../../shared/item/item-container.component';
@Component({
  selector: 'app-comment',
  imports: [CommonModule, FormsModule, ButtonModule, ItemContainerComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent {
 @Input() comment!: Comment;
  @Output() replyEmitter = new EventEmitter<{ replyText: string; parentCommentId: number }>();

  showReplyForm = false;
  replyText = '';

  toggleReplyForm() {
    this.showReplyForm = !this.showReplyForm;
    if (!this.showReplyForm) {
      this.replyText = '';
    }
  }

  submitReply() {
    const trimmedReply = this.replyText.trim();
    if (!trimmedReply) return;

    this.replyEmitter.emit({ replyText: trimmedReply, parentCommentId: this.comment.id });
    this.toggleReplyForm();
  }
}
