export enum KillstreakTier {
  None = 0,
  Standard = 1,
  Specialized = 2,
  Professional = 3,
}
export enum Spell {
  BruisedPurpleFootprints = 'Bruised Purple Footprints',
  CorpseGrayFootprints = 'Corpse Gray Footprints',
  GangreenFootprints = 'Gangreen Footprints',
  HeadlessHorseshoes = 'Headless Horseshoes',
  RottenOrangeFootprints = 'Rotten Orange Footprints',
  TeamSpiritFootprints = 'Team Spirit Footprints',
  ViolentVioletFootprints = 'Violent Violet Footprints',
  ChromaticCorruption = 'Chromatic Corruption',
  DieJob = 'Die Job',
  PutrescentPigmentation = 'Putrescent Pigmentation',
  SinisterStaining = 'Sinister Staining',
  SpectralSpectrum = 'Spectral Spectrum',
  ScoutsSpectralSnarl = "Scout's Spectral Snarl",
  SoldiersBoomingBark = "Soldier's Booming Bark",
  PyrosMuffledMoan = "Pyro's Muffled Moan",
  DemomansCadaverousCroak = "Demoman's Cadaverous Croak",
  HeavysBottomlessBass = "Heavy's Bottomless Bass",
  EngineersGravellyGrowl = "Engineer's Gravelly Growl",
  MedicsBloodCurdlingBellow = "Medic's Blood Curdling Bellow",
  SnipersDeepDownunderDrawl = "Sniper's Deep Downunder Drawl",
  SpysCreepyCroon = "Spy's Creepy Croon",
  Exorcism = 'Exorcism',
  GourdGrenades = 'Gourd Grenades',
  SentryQuadPumpkins = 'Sentry Quad-Pumpkins',
  SpectralFlame = 'Spectral Flame',
  SquashRockets = 'Squash Rockets',
}


export interface KillstreakFormValue {
  killstreak: KillstreakTier;
  sheen: string;
  killstreaker: string;
}