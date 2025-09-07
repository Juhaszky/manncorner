import { Component, inject, Input, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { ActionBarComponent } from '../../../add-trade/action-bar/action-bar.component';
import { InventoryItemsSelectorComponent } from '../../../add-trade/inventory-items-selector/inventory-items-selector.component';
import { CommonModule } from '@angular/common';
import { ItemContainerComponent } from '../../../../shared/item/item-container.component';
import { ItemSelectorFacade } from '../../../../shared/item-selector/item-selector.facade';
import { OfferItemSelectorComponent } from '../../../add-trade/offer-item-selector/offer-item-selector.component';
import { Item } from '../../../../shared/models/item.model';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../../shared/models/comment.model';
import { CommentComponent } from './comment/comment.component';
import { CommentService } from './comment.service';
@Component({
  selector: 'app-comments',
  imports: [
    CommonModule,
    TabsModule,
    ButtonModule,
    FormsModule,
    ActionBarComponent,
    InventoryItemsSelectorComponent,
    CommonModule,
    ItemContainerComponent,
    OfferItemSelectorComponent,
    CommentComponent,
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnInit {
  @Input() tradeId!: string;
  @Input() comments: Comment[] = [];
  commentData!: string;
  selectedItems: Item[] = [];

  http = inject(HttpClient);
  commentService = inject(CommentService);
  itemSelectorFacade = inject(ItemSelectorFacade);

  get rootComments(): Comment[] {
    return this.comments.filter((c) => !c.parentCommentId);
  }

  ngOnInit(): void {
    this.itemSelectorFacade.itemsOfferTrade$.subscribe(i => {
      this.selectedItems = i;
      console.log(i);
    });
  }

  makeComment() {
    this.commentService.makeComment({
      tradeId: this.tradeId,
      commentData: this.commentData,
    });
  }
  handleReplyEmitter(event: { replyText: string; parentCommentId: number }) {
    console.log('emitter ran');
    this.commentService.makeComment({
      tradeId: this.tradeId,
      commentData: event.replyText,
      parentId: event.parentCommentId,
    });
  }
}
