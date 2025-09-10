import { Item } from "./item.model";
import { ProfileData } from "./ProfileData";

export interface Comment {
    id: number;
    tradeId: number;
    userId: number;
    commentData: string;
    createdAt: Date;
    owner: ProfileData
    parentCommentId?: number;
    replies: Comment[];
    itemsOffer: Item[]
}