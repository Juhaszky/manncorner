import itemNames from 'tf2-static-schema/static/item-names.json';

const allItemNames: Record<number, string> = itemNames;

export const getPaints = () => {
  return allItemNames;
};
