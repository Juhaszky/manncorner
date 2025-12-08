export interface Item {
  name: string;
  fullName: string;
  id: string;
  img: string;
  craftable: boolean;
  tradable: boolean;
  type: string;
  effect?: number;
  killstreak?: number;
  sheen?: string;
  killstreaker?: string;
  quality: number;
  defindex: number;
  //econitem attributes
  isAustralium?: boolean;
  marketable?: boolean;
  commodity?: boolean;
  level?: string | number;
  classes?: string[];
  parts?: string[];
  spells?: string[];
  isSelling?: boolean;
  quantity?: number;
}
