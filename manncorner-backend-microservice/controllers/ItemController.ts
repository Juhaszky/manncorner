import rawItems from 'tf2-static-schema/static/items.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { parseEconItem } from 'tf2-item-format/static';
import { TF2Item } from '../models/Tf2Item';
import { EconItem } from 'tf2-item-format/.';
import { Item } from '../models/Item';

const allItems = rawItems as TF2Item[];
export const getItems = (searchTerm?: string) => {
  const filtered: Item[] = allItems.map((i) => parseStockItemToItem(i));

  // if (searchTerm) {
  //   const lower = searchTerm.toLowerCase();
  //   filtered = allItems.map((i) => parseStockItemToItem(i)).filter(
  //     item =>
  //       item.item_name?.toLowerCase().includes(lower) ||
  //       item.name?.toLowerCase().includes(lower)
  //   );
  // }

  return filtered;
};
export const parseItem = (item: any) => {
  try {
    const rawItem = sanitizeEconItem(item);
    return parseEconItem(rawItem, true, true, { useTrueDefindex: true });
  } catch (error) {
    console.error('Failed to parse item:', {
      error,
      itemPreview: {
        id: item?.id,
        classid: item?.classid,
        instanceid: item?.instanceid,
        name: item?.market_hash_name,
      },
    });
    return {};
  }
};

function sanitizeEconItem(rawItem: any): EconItem {
  console.log("assetId:", rawItem);
  return {
    assetid: rawItem.assetid || rawItem.Assetid || rawItem.assetId || '',

    descriptions: Array.isArray(rawItem.Descriptions || rawItem.descriptions)
      ? (rawItem.Descriptions || rawItem.descriptions).map((desc: any) => ({
          value: desc.Value || desc.value || '',
          color:
            typeof (desc.Color ?? desc.color) === 'string'
              ? (desc.Color ?? desc.color)
              : undefined,
        }))
      : [],

    name:
      typeof (rawItem.market_name ?? rawItem.name) === 'string'
        ? (rawItem.market_name ?? rawItem.market_name)
        : '',

    market_name:
      typeof (rawItem.Market_Name ?? rawItem.market_name) === 'string'
        ? (rawItem.Market_Name ?? rawItem.market_name)
        : '',

    market_hash_name:
      typeof (rawItem.Market_Hash_Name ?? rawItem.market_hash_name) === 'string'
        ? (rawItem.Market_Hash_Name ?? rawItem.market_hash_name)
        : '',

    tags: Array.isArray(rawItem.Tags || rawItem.tags)
      ? (rawItem.Tags || rawItem.tags).map((tag: any) => ({
          category: tag.Category || tag.category || '',
          name: tag.Internal_Name || tag.internal_Name || tag.name || '',
          localizedCategoryName:
            tag.Localized_Category_Name ||
            tag.localized_Category_Name ||
            tag.localizedCategoryName ||
            '',
          localizedTagName:
            tag.Localized_Tag_Name ||
            tag.localized_Tag_Name ||
            tag.localizedTagName ||
            '',
          color:
            typeof (tag.Color ?? tag.color) === 'string'
              ? (tag.Color ?? tag.color)
              : undefined,
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

    type: rawItem.Type ?? rawItem.type ?? '',

    tradable: rawItem.Tradable ?? rawItem.tradable ?? false,

    commodity: rawItem.Commodity ?? rawItem.commodity ?? false,

    marketable: rawItem.Marketable ?? rawItem.marketable ?? false,

    icon_url: rawItem.Icon_Url ?? rawItem.icon_url,

    icon_url_large: rawItem.Icon_Url_Large ?? rawItem.icon_url_large,

    appid: rawItem.Appid ?? rawItem.appid,

    contextid: rawItem.Contextid ?? rawItem.contextid,

    instanceid: rawItem.Instanceid ?? rawItem.instanceid,

    classid: rawItem.Classid ?? rawItem.classid,

    amount: rawItem.Amount ?? rawItem.amount,

    currency: rawItem.Currency ?? rawItem.currency,

    actions: rawItem.Actions ?? rawItem.actions,

    market_actions: rawItem.Market_Actions ?? rawItem.market_actions,

    background_color: rawItem.Background_Color ?? rawItem.background_color,

    name_color: rawItem.Name_Color ?? rawItem.name_color,

    market_tradable_restriction:
      rawItem.Market_Tradable_Restriction ??
      rawItem.market_tradable_restriction,

    market_marketable_restriction:
      rawItem.Market_Marketable_Restriction ??
      rawItem.market_marketable_restriction,

    fraudwarnings: rawItem.FraudWarnings ?? rawItem.fraudwarnings,
  };
}
export function parseStockItemToItem(stockItem: any): Item {
  return {
    name: stockItem.item_name || stockItem.name || '',
    fullName: stockItem.proper_name ? `The ${stockItem.item_name}` : stockItem.item_name || stockItem.name || '',
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
