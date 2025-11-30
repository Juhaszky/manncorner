import { Item } from './item.model';

export interface StrangeItemStatHistory {
  id: number;
  userId: string;
  itemId: string;
  counter: number;
  counters: [
    {
      changeDate: Date;
      value: number;
    },
  ];
  changeDate: Date;
}
export interface StrangeItemStatWithItemDto {
  stat: StrangeItemStatHistory;
  item: Item;
}
