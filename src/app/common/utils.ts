import { Item } from '../../shared/models/item.model';
import { ModifiedItemData } from '../../shared/models/modifiedItem.model';
import { StockTF2Item } from '../../shared/models/stockItem.model';

const qualityMap: Record<number, string> = {
  0: 'Normal',
  1: 'Genuine',
  2: 'rarity2',
  3: 'Vintage',
  4: 'rarity3',
  5: 'Unusual',
  6: 'Unique',
  7: 'Community',
  8: 'Valve',
  9: 'Self-Made',
  10: 'Customized',
  11: 'Strange',
  12: 'Completed',
  13: 'Haunted',
  14: "Collector's",
  15: 'Decorated Weapon',
};

export function getItemBorderStyle(item: Item): string {
  if (item.quality === 15) {
    return "decoratedWeapon";
  } else if (item.quality === 14) {
    return "Collectors"
  }
  return qualityMap[item.quality];
}

export function parseStockItemToItem(stockItem: StockTF2Item): Item {
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

export function chunkItems(
  array: ModifiedItemData[],
  chunkSize: number
): ModifiedItemData[][] {
  return array.reduce<ModifiedItemData[][]>((result, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!result[chunkIndex]) {
      result[chunkIndex] = [];
    }
    result[chunkIndex].push(item);
    return result;
  }, [] as ModifiedItemData[][]);
}
