import { ModifiedItemData } from "../../shared/models/modifiedItem.model";

export function getItemBorderStyle(item: any): string {
  console.log(item);
  if (item?.name?.includes('Unusual')) {
    return 'unusual';
  } else if (item?.name?.includes('Strange')) {
    return 'strange';
  } else if (item?.name?.includes('Genuine')) {
    return 'genuine';
  } else if (item?.name?.includes('Haunted')) {
    return 'haunted';
  } else if (item?.name?.includes("Collector's")) {
    return 'collectors';
  } else if (item?.name?.includes('Vintage')) {
    return 'vintage';
  } else if (
    (item?.descriptions && item?.descriptions[0]?.value?.includes('Elite')) ||
    item?.descriptions?.value?.includes('Elite')
  ) {
    return 'elite';
  } else {
    return 'unique';
  }
}
export function chunkItems(array: ModifiedItemData[], chunkSize: number): ModifiedItemData[][] {
  return array.reduce<ModifiedItemData[][]>((result, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!result[chunkIndex]) {
      result[chunkIndex] = [];
    }
    result[chunkIndex].push(item);
    return result;
  }, [] as ModifiedItemData[][]);
}
