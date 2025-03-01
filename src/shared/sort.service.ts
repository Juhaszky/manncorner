import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModifiedItemData } from './models/modifiedItem.model';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  private sortCriteriaSubject = new BehaviorSubject<'quality' | 'name'>('name');
  sortCriteria$ = this.sortCriteriaSubject.asObservable();
  private effectPriorityMap: { [key: string]: number } = {
    Unusual: 0,
    Elite: 1,
    Assassin: 2,
    Commando: 3,
    Mercenary: 4,
    Vintage: 5,
    Strange: 6,
    Unique: 7,
    // Add more effects as necessary
  };
  setSortCriteria(criteria: 'quality' | 'name') {
    this.sortCriteriaSubject.next(criteria);
  }
  getCurrentSortCriteria(): 'quality' | 'name' {
    return this.sortCriteriaSubject.value;
  }
  sortItems(
    items: ModifiedItemData[],
    criteria: 'quality' | 'name'
  ): ModifiedItemData[] {
    if (criteria === 'name') {
      return items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'quality') {
      return items.sort((a, b) => {
        const qualityA = this.getFirstQualityValue(a);
        const qualityB = this.getFirstQualityValue(b);

        // Handle undefined by treating it as a low quality (or customize this logic)
        return (qualityA ?? Infinity) - (qualityB ?? Infinity);
      });
    }

    return items;
  }

  private getFirstQualityValue(item: ModifiedItemData): number | undefined {
    let qualityValue = item.quality;
    if (!qualityValue) {
      const rarity =
        item.tags.find((tag) => tag.category === 'Rarity')
          ?.localized_tag_name || undefined;
      if (rarity) {
        return this.getEffectPriority(rarity);
      }
      const itemQuality =
        item.tags.find((tag) => tag.category === 'Quality')
          ?.localized_tag_name || undefined;
      console.log(itemQuality);
      if (itemQuality) {
        return this.getEffectPriority(itemQuality); // Default value if quality is undefined or empty
      }
    }
    return undefined;
  }
  private getEffectPriority(quality?: string | undefined): number | undefined {
    let priority = undefined;
    if (quality) {
      priority = this.effectPriorityMap[quality]; // Default to Infinity if effect is not in the map
    }
    return priority;
  }
}
