import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getItemBorderStyle } from '../../app/common/utils';
import { BehaviorSubject } from 'rxjs';
import { ModifiedItemData } from '../../shared/models/modifiedItem.model';
import { Item } from '../../shared/models/item.model';

@Injectable({ providedIn: 'root' })
export class TradeServiceFacade {
    private tradeItemsToSell = new BehaviorSubject<ModifiedItemData[]>([]);
    itemsToSell$ = this.tradeItemsToSell.asObservable();
    constructor(
        private router: Router
    ) { }


}