import { Injectable } from '@angular/core';
import { Quality, QualityType } from './models/quality.model';



@Injectable({
  providedIn: 'root',
})
export class ItemExtrasService {
  qualities: Quality[] = [
    { type: 'Normal', color: '' },
    { type: 'Unique', color: '' },
    { type: 'Vintage', color: '' },
    { type: 'Genuine', color: '' },
    { type: 'Strange', color: '' },
    { type: 'Unusual', color: '' },
    { type: 'Haunted', color: '' },
    { type: "Collector's", color: '' },
  ];
  qualityMap: { [key in QualityType]: string } = {
    [QualityType.Normal]: 'normal',
    [QualityType.Unique]: 'unique',
    [QualityType.Vintage]: 'vintage',
    [QualityType.Genuine]: 'genuine',
    [QualityType.Strange]: 'strange',
    [QualityType.Unusual]: 'unusual',
    [QualityType.Haunted]: 'haunted',
    [QualityType.Collectors]: 'collectors',
  };
  constructor() {}

  getAllQualities(): Quality[] {
    return this.qualities;
  }

  getClassByQuality(qualityType: string): string {
    const key = qualityType as QualityType;
    return this.qualityMap[key] || '';
  }
}
