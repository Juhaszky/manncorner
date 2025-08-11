export enum KillstreakTier {
  None = 0,
  Standard = 1,
  Specialized = 2,
  Professional = 3,
}

export interface KillstreakFormValue {
  killstreak: KillstreakTier;
  sheen: string;
  killstreaker: string;
}