import { Item } from "./item.model";

export interface ProfileData {
    level: number;
    progress: number;
    id: number;
    steamId: string;
    tradeUrl: string;
    xp: number;
    username: string;
    avatarPath: string;
    favoriteItems: Item[]
}