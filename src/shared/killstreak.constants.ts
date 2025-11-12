import { KillstreakTier } from "./models/enums/item-customization.enum";

export const KILLSTREAK_TIERS = [
  { label: 'None', value: KillstreakTier.None },
  { label: 'Standard', value: KillstreakTier.Standard },
  { label: 'Specialized', value: KillstreakTier.Specialized },
  { label: 'Professional', value: KillstreakTier.Professional },
] as const;

export const SHEENS = [
  'Team Shine',
  'Deadly Daffodil',
  'Manndarin',
  'Mean Green',
  'Agonizing Emerald',
  'Villainous Violet',
  'Hot Rod',
] as const;

export const KILLSTREAKERS = [
  'Fire Horns',
  'Flames',
  'Hypno-Beam',
  'Incinerator',
  'Singularity',
  'Tornado',
] as const;

