interface Action {
  link: string;
  name: string;
}

interface Tag {
  category: string;
  internal_name: string;
  localized_category_name: string;
  localized_tag_name: string;
  color?: string; // Optional because not all tags have a color
}
interface Description {
    value: string;
    color?: string;
}

export interface ItemData {
  appid: number;
  classid: string;
  instanceid: string;
  currency: number;
  background_color: string;
  icon_url: string;
  icon_url_large: string;
  descriptions: Description[];
  tradable: number;
  actions: Action[];
  name: string;
  name_color: string;
  type: string;
  market_name: string;
  market_hash_name: string;
  market_actions: Action[];
  commodity: number;
  market_tradable_restriction: number;
  market_marketable_restriction: number;
  marketable: number;
  tags: Tag[];
  idx: number;
  image_url: string;
  imageUrl: string;
  selected: boolean;
}
