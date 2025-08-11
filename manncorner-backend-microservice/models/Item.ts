export interface Item {
  name: string;
  fullName: string;
  id: string | null;
  img: string;
  craftable: boolean;
  tradable: boolean;
  type: string;
  effect?: number;
  quality: number;
  defindex: number;
  killstreak: number;
  killstreaker: string;
  sheen: string;
  //econitem attributes
  marketable?: boolean;
  commodity?: boolean;
  level?: string;
  classes?: string[];
  parts?: string[];
  spells?: string[];
}
