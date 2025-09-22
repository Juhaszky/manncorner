import { Comment } from "./comment.model";
import { Item } from "./item.model";

export interface Trade {
    id: string;
    description: string;
    bumpDate: Date;
    createdAt: Date;
    items: Item[];
    status: string;
    deleted: boolean;
    username: string;
    userId: string;
    comments: Comment[]
}
export interface TradeResult {
    page: number;
    pageSize: number;
    totalCount: number;
    trades: Trade[]
}