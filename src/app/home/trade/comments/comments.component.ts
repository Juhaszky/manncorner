import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../../../shared/models/comment.model';
import { CommentService } from './comment.service';
import { Item } from '../../../../shared/models/item.model';
import { ItemSelectorFacade } from '../../../../shared/item-selector/item-selector.facade';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { CommentComponent } from './comment/comment.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemContainerComponent } from '../../../../shared/item/item-container.component';
import { ActionBarComponent } from '../../../add-trade/action-bar/action-bar.component';
import { OfferItemSelectorComponent } from '../../../add-trade/offer-item-selector/offer-item-selector.component';


@Component({
  selector: 'app-comments',
  imports: [ButtonModule, TabsModule, CommentComponent, FormsModule, CommonModule, ItemContainerComponent, ActionBarComponent, OfferItemSelectorComponent],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  tabsValue = 0
  @Input() tradeId!: string;
  @Input() comments: Comment[] = [];
  commentData = '';
  selectedItems: Item[] = [];

  constructor(
    private commentService: CommentService,
    public itemSelectorFacade: ItemSelectorFacade
  ) {}

  get rootComments(): Comment[] {
    return this.comments.filter(c => !c.parentCommentId);
  }

  ngOnInit() {
    this.itemSelectorFacade.itemsOfferTrade$.subscribe(items => {
      this.selectedItems = items;
    });
  }

  handleCommentSubmit({ text, parentId }: { text: string; parentId?: number }) {
    if (!text?.trim()) return;
    
    this.commentService.makeComment({
      tradeId: this.tradeId,
      commentData: text.trim(),
      parentId: parentId ?? undefined,
      itemsOffer: this.selectedItems
    }).subscribe(newComment => {
      if (newComment.parentCommentId) {
        const parentIndex = this.comments.findIndex(c => c.id === newComment.parentCommentId);
        if (parentIndex > -1) {
          const parent = this.comments[parentIndex];
          const updatedReplies = [...(parent.replies || []), newComment];
          const updatedParent = { ...parent, replies: updatedReplies };
          this.comments = [
            ...this.comments.slice(0, parentIndex),
            updatedParent,
            ...this.comments.slice(parentIndex + 1),
          ];
        }
      } else {
        this.comments = [...this.comments, newComment];
      }
      this.itemSelectorFacade.emptyOfferItems();
    });
    if (!parentId) {
      this.commentData = '';
    }
  }
}
