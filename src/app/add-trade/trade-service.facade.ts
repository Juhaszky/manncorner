import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getItemBorderStyle } from '../../app/common/utils';
import { BehaviorSubject } from 'rxjs';
import { ModifiedItemData } from '../../shared/models/modifiedItem.model';

@Injectable({ providedIn: 'root' })
export class TradeServiceFacade {
    private tradeItemsToSell = new BehaviorSubject<ModifiedItemData[]>([]);
    itemsToSell$ = this.tradeItemsToSell.asObservable();
    constructor(
        private router: Router
    ) { }


    onAddItem(item: ModifiedItemData) {
        const exists = this.tradeItemsToSell.getValue().find((i) => i.idx === item.idx);
        if (!exists) {
            this.tradeItemsToSell.next([...this.tradeItemsToSell.getValue(), item]);
        }
    }
    onRemoveItem(item: ModifiedItemData) {
        this.tradeItemsToSell.next(this.tradeItemsToSell.getValue().filter((i) => i.idx != item.idx));
    }
    clear() {
        this.tradeItemsToSell.next([]);
    }

    openItemDetails() {
        return null;
    }

    handleCustomizeItem(item: ModifiedItemData) {
        this.resetItemName(item);
    }

    resetItemName(item: ModifiedItemData): void {
        if (item.originalName) {
            item.name = item.originalName;
        }
    }

    getBorderStyle(item: ModifiedItemData): string {
        return getItemBorderStyle(item);
    }

    checkItemExtras(item: ModifiedItemData) {
        if (item.descriptions && item.descriptions.length > 0) {
            const descriptions = item.descriptions;
            descriptions.forEach(desc => {
                if (desc.value.includes('Halloween')) {
                    item.spell = desc.value;
                } else if (desc.value.includes('Killstreaker')) {
                    if (item.killstreaker) {
                        item.killstreaker.killstreaker = desc.value;
                    }
                } else if (desc.value.includes('Sheen')) {
                    if (item.killstreaker) {
                        item.killstreaker.sheen = desc.value;
                    }
                }
            });
        }
    }
}