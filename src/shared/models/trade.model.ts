import { Item } from "./item.model";

export interface Trade {
    id: string;
    description: string;
    createdAt: Date;
    items: Item[];
    status: string;
    username: string;
    userId: string;
}
export interface TradeResult {
    page: number;
    pageSize: number;
    totalCount: number;
    trades: Trade[]
}