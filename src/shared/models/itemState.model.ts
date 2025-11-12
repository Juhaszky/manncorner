import { ItemData } from './itemData.model';
import { ModifiedItemData } from './modifiedItem.model';
import { StockTF2Item } from './stockItem.model';

export interface ItemState {
  inventoryItems: ItemData[];
  filteredInventoryItems: ItemData[];
  allItems: StockTF2Item[];
  toTradeItems: ItemData[];
  forTradeItems: ModifiedItemData[];
  filterText: string;
}
