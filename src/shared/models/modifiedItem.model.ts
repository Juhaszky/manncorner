import { ItemData } from "./itemData.model";
import { Killstreaker } from "./killstreaker.model";
 
export interface ModifiedItemData extends ItemData {
    selected: boolean;
    spell?: string;
    killstreaker?: Killstreaker;
    part?: string;
    effect?: string;
    quality?: string[];
    originalName?: string;
}