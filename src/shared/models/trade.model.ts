import { Item } from "./item.model";

export interface Trade {
    id: string;
    description: string;
    createdAt: string;
    items: Item[];
    status: string;
    username: string;
    userId: string;
}