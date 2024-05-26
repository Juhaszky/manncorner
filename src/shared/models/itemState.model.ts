import { StockItem } from "./stockItem.model";

export interface ItemState {
    inventoryItems: any[];
    allItems: StockItem[];
    toTradeItems: any[];
    forTradeItems: any[];
  }