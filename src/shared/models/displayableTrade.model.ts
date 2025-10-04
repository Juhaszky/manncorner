import { Item } from "./item.model";

export interface displayableTrade {
  itemsToSell: Item[];
  itemsToBuy: Item[];
  id: string;
  avatarPath: string;
  username: string;
  createdAt: Date;
  bumpedAt: Date;
  description: string;
}
