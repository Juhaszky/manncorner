import { Item } from "./item.model";

export interface StockItem extends Item {
    item_class: string;
    item_slot: string;
    item_quality: number;
    image_url: string;
    image_url_large: string;
    craft_class: string;
    craft_material_type: string;
}