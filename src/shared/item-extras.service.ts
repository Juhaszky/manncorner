import { Injectable } from '@angular/core';
import { QualityMap, QualityType } from './models/quality.model';

@Injectable({
  providedIn: 'root',
})
export class ItemExtrasService {
  qualities: QualityMap = {
    Normal: 0,
    Genuine: 1,
    rarity2: 2,
    Vintage: 3,
    rarity3: 4,
    Unusual: 5,
    Unique: 6,
    Community: 7,
    Valve: 8,
    'Self-Made': 9,
    Customized: 10,
    Strange: 11,
    Completed: 12,
    Haunted: 13,
    "Collector's": 14,
    'Decorated Weapon': 15,
  };

  getAllQualities(): QualityMap {
    return this.qualities;
  }

  getClassByQuality(qualityType: string): string {
    if (qualityType === "Collector's") {
      return "Collectors";
    }
    return qualityType;
  }
  getItemEffectUrl(effect: string): string {
    return `/assets/images/effects/${effect}.webp`;
  }
}
