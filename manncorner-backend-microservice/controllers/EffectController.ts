import rawEffects from 'tf2-static-schema/static/effects.json';

const allEffects: Record<number, string> = rawEffects;

export const getEffects = () => {
  return allEffects;
};
