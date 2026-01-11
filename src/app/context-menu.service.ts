import { isPlatformBrowser } from '@angular/common';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ContextMenu } from 'primeng/contextmenu';
import { Item } from '../shared/models/item.model';
import { MenuItem, MessageService } from 'primeng/api';
import { ItemFacade } from '../shared/item/item.facade';

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  private selectedItem: Item | null = null;
  private menuInstance: ContextMenu | null = null;
  menuVisible = false;
  itemFacade = inject(ItemFacade);
  messageService = inject(MessageService);
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  setSelectedItem(item: Item) {
    this.selectedItem = item;
  }

  getSelectedItem() {
    return this.selectedItem;
  }

  registerMenu(menu: ContextMenu) {
    this.menuInstance = menu;
  }

  show(event: MouseEvent, item: Item) {
    if (isPlatformBrowser(this.platformId)) {
      this.setSelectedItem(item);
      this.menuInstance?.show(event);
    }
  }

  getContextMenuItems(): MenuItem[] {
    return [
      {
        label: 'Open on Bp.tf',
        command: () => {
          const item = this.getSelectedItem();
          if (item) {
            this.itemFacade.openBackpackTfLink(item);
          }
        },
      },
      {
        label: 'Open history on Bp.tf',
        command: () => {
          const item = this.getSelectedItem();
          if (item && (item.isSelling || item.commentId)) {
            this.itemFacade.openBackpackTfHistory(item);
          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'No history available for this item.',
            });
          }
        },
      },
    ];
  }
}
