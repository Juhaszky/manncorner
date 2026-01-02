import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserDataService } from '../../shared/user-data.service';
import { UserProfileService } from './user-profile.service';
import { BehaviorSubject, filter, map, switchMap, take } from 'rxjs';
import { ToastMessage } from '../../shared/models/enums/error-message.enum';
import { ItemSelectorFacade } from '../../shared/item-selector/item-selector.facade';
import { Item } from '../../shared/models/item.model';
import { ProfileData } from '../../shared/models/ProfileData';

@Injectable({ providedIn: 'root' })
export class UserProfileFacade {
  private readonly LEVELS = [
    { level: 0, xp: 0 },
    { level: 1, xp: 50 },
    { level: 2, xp: 150 },
    { level: 3, xp: 250 },
  ];

  tradeControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  private profileSubject = new BehaviorSubject<ProfileData | null>(null);
  profileData$ = this.profileSubject.asObservable();
  userData$ = this.userDataService.userData$.pipe(filter(data => !!data));

  chipData$ = this.userData$.pipe(
    map(data => this.generateChips(data.steamid))
  );

  private _profileFavouriteItems = new BehaviorSubject<Item[] | null>(null);
  profileFavouriteItems$ = this._profileFavouriteItems.asObservable();

  setProfileFavouriteItems(items: Item[]): void {
    this._profileFavouriteItems.next(items);
  }

  constructor(
    private userDataService: UserDataService,
    private userProfileService: UserProfileService,
    private itemselectorFacade: ItemSelectorFacade,
    private messageService: MessageService
  ) {}

  saveTradeUrl(): void {
    this.userData$
      .pipe(
        switchMap(data =>
          this.userProfileService
            .saveTradeUrl(data.steamid, this.tradeControl.value)
            .pipe(
              switchMap(() =>
                this.userProfileService.getProfileData(data.steamid)
              )
            )
        )
      )
      .subscribe({
        next: res => {
          this.tradeControl.setValue(res.tradeUrl, { emitEvent: false });
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: ToastMessage.PROFILE_CHANGE_TRADE_URL_SUCCESS,
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: ToastMessage.PROFILE_CHANGE_TRADE_URL_FAIL,
          });
        },
      });
  }

  loadProfile(steamId: string): void {
    this.userProfileService.getProfileData(steamId).subscribe({
      next: profile => {
        const { level, progress } = this.calculateProgress(profile.xp);
        this.profileSubject.next({ ...profile, level, progress });
        this.tradeControl.setValue(profile.tradeUrl, { emitEvent: false });
      },
    });
  }
  saveFavouriteItems(item?: Item): void {
    this.userData$.pipe(take(1)).subscribe(userData => {
      this.itemselectorFacade.itemsFavourite$.pipe(take(1)).subscribe(items => {
        const toSave = item ? items.filter(i => i.id !== item.id) : items;

        this.userProfileService
          .saveFavouriteItems(userData.steamid, toSave)
          .subscribe({
            complete: () => {
              this.itemselectorFacade.emptyFavouriteItems();

              this.loadProfile(userData.steamid);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: ToastMessage.PROFILE_CHANGE_FAVOURITE_ITEMS_SUCCESS,
              });
            },
            error: err =>
              this.messageService.add({
                severity: 'error',
                detail: ToastMessage.PROFILE_CHANGE_TRADE_URL_FAIL,
              }),
          });
      });
    });
  }

  private generateChips(steamId: string) {
    return [
      {
        label: 'Steam',
        link: `https://steamcommunity.com/profiles/${steamId}`,
      },
      { label: 'Backpack.tf', link: `https://backpack.tf/profiles/${steamId}` },
      { label: 'Rep.tf', link: `https://rep.tf/${steamId}` },
    ];
  }

  private calculateProgress(xp: number): { level: number; progress: number } {
    for (let i = this.LEVELS.length - 1; i >= 0; i--) {
      if (xp >= this.LEVELS[i].xp) {
        const next = this.LEVELS[i + 1]?.xp;
        const progress =
          next != null
            ? ((xp - this.LEVELS[i].xp) / (next - this.LEVELS[i].xp)) * 100
            : 100;
        return {
          level: this.LEVELS[i].level,
          progress: Math.min(progress, 100),
        };
      }
    }
    return { level: 0, progress: 0 };
  }
}
