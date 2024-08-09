import { ItemData } from './itemData.model';
import { ModifiedItemData } from './modifiedItem.model';
import { StockItem } from './stockItem.model';

export interface ItemState {
  inventoryItems: ItemData[];
  filteredInventoryItems: ItemData[];
  allItems: StockItem[];
  toTradeItems: ItemData[];
  forTradeItems: ModifiedItemData[];
  filterText: string;
}
