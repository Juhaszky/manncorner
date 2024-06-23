import { StockItem } from "./stockItem.model";

export interface ItemState {
    inventoryItems: any[];
    filteredInventoryItems: any[];
    allItems: StockItem[];
    toTradeItems: any[];
    forTradeItems: any[];
    filterText: string;
  }