export class CreateItemDto {
  readonly id: number;
  readonly name: string;
  readonly item_class: string;
  readonly item_slot: string;
  readonly item_quality: number;
  readonly image_url: string;
  readonly image_url_large: string;
  readonly craft_class: string;
  readonly craft_material_type: string;
}
