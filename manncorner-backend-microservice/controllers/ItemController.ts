import rawItems from 'tf2-static-schema/static/items.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { parseEconItem } from 'tf2-item-format/static';
import { TF2Item } from '../models/Tf2Item';
import { EconItem } from 'tf2-item-format/.';
import { Item } from '../models/Item';

const allItems = rawItems as TF2Item[];
export const getItems = (searchTerm?: string) => {
  //let filtered: Item[] = allItems.map(i => parseStockItemToItem(i));
  const DEFAULT_ITEMS = allItems
    .filter(i => [5021, 5002, 5000, 5001].includes(i.defindex))
    .map(i => parseStockItemToItem(i));

  let filtered: Item[] = [];
  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    filtered = allItems
      .filter(
        item =>
          item.item_name?.toLowerCase().includes(lower) ||
          item.name?.toLowerCase().includes(lower)
      )
      .map(i => parseStockItemToItem(i))
      .slice(0, 50);
  } else {
    filtered = allItems.slice(0, 50).map(i => parseStockItemToItem(i));
  }

  return [...DEFAULT_ITEMS, ...filtered];
};

export const parseItems = (items: any[]) => {
  try {
    const sanitizedItems = items.map(i => sanitizeEconItem(i));
    console.log(sanitizedItems);
    const parsedItems = sanitizedItems.map(item =>
      parseEconItem(item, true, true, { useTrueDefindex: true })
    );
    return parsedItems;
  } catch (error: any) {
    return [];
  }
};

function sanitizeEconItem(rawItem: any): EconItem {
  return {
    assetid: rawItem.assetid || rawItem.Assetid || rawItem.assetId || '',
    descriptions: Array.isArray(rawItem.Descriptions || rawItem.descriptions)
      ? (rawItem.Descriptions || rawItem.descriptions).map((desc: any) => ({
          value: desc.Value ?? desc.value,
          color: desc.Color ?? desc.color,
          name: desc.Name,
        }))
      : [],
    name: rawItem.Name ?? rawItem.name,
    name_color: rawItem.Name_Color,
    market_name: rawItem.Market_Name ?? rawItem.market_Name,
    market_hash_name: rawItem.Market_Hash_Name ?? rawItem.market_Hash_Name,
    tags: Array.isArray(rawItem.Tags || rawItem.tags)
      ? (rawItem.Tags || rawItem.tags).map((tag: any) => ({
          category: tag.Category ?? tag.category,
          internal_name: tag.Internal_Name ?? tag.internal_Name,
          localized_category_name:
            tag.Localized_Category_Name ?? tag.localized_Category_Name,
          localized_tag_name: tag.Localized_Tag_Name ?? tag.localized_Tag_Name,
          color: tag.Color ?? tag.color,
        }))
      : [],
    app_data:
      rawItem.App_Data || rawItem.app_data
        ? {
            def_index:
              rawItem.App_Data?.Def_Index ?? rawItem.app_data?.def_index ?? 0,
            quality:
              rawItem.App_Data?.Quality ?? rawItem.app_data?.quality ?? 0,
            quantity: rawItem.App_Data?.Quantity ?? rawItem.app_data?.quantity,
          }
        : undefined,
    type: rawItem.Type ?? rawItem.type,
    tradable: (rawItem.Tradable ?? rawItem.tradable == 1) ? true : false,
    marketable: (rawItem.Marketable ?? rawItem.marketable == 1) ? true : false,
    commodity: rawItem.Commodity ?? rawItem.commodity,
    icon_url: rawItem.Icon_Url ?? rawItem.icon_Url,
    icon_url_large: rawItem.Icon_Url_Large ?? rawItem.icon_Url_Large,
    appid: rawItem.Appid ?? rawItem.appid,
    contextid: rawItem.Contextid ?? rawItem.contextid,
    instanceid: rawItem.Instanceid ?? rawItem.instanceid,
    classid: rawItem.Classid ?? rawItem.classid,
    amount: rawItem.Amount ?? rawItem.amount,
    currency: rawItem.Currency ?? rawItem.currency,
    actions: rawItem.Actions ?? rawItem.actions,
    market_actions: rawItem.Market_Actions ?? rawItem.market_actions,
    background_color: rawItem.Background_Color ?? rawItem.background_Color,
    market_tradable_restriction:
      rawItem.Market_Tradable_Restriction ??
      rawItem.market_Tradable_Restriction,
    market_marketable_restriction:
      rawItem.Market_Marketable_Restriction ??
      rawItem.market_Marketable_Restriction,
    fraudwarnings: rawItem.FraudWarnings ?? rawItem.fraudwarnings,
  };
}

export function parseStockItemToItem(stockItem: any): Item {
  return {
    name: stockItem.item_name || stockItem.name || '',
    fullName: stockItem.proper_name
      ? `The ${stockItem.item_name}`
      : stockItem.item_name || stockItem.name || '',
    id: null,
    img: stockItem.image_url_large || stockItem.image_url || '',
    craftable: stockItem.capabilities.can_craft_mark,
    tradable: true,
    type: stockItem.item_type_name || 'Unknown',
    quality: stockItem.item_quality ?? 0,
    defindex: stockItem.defindex,
    marketable: true,
    commodity: false,
    level: `${stockItem.min_ilevel || ''}${stockItem.max_ilevel ? `-${stockItem.max_ilevel}` : ''}`,
    classes: stockItem.used_by_classes || [],
    parts: [],
    spells: [],
  };
}
