import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserDataService } from '../../shared/user-data.service';
import { UserProfileService } from './user-profile.service';
import { filter, map, switchMap } from 'rxjs';

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

    userData$ = this.userDataService.userData$.pipe(
        filter(data => !!data));

    chipData$ = this.userData$.pipe(
        map(data => this.generateChips(data.steamid))
    );

    profileData$ = this.userData$.pipe(
        switchMap(data =>
            this.userProfileService.getTradeUrl(data.steamid).pipe(
                map(profile => {
                    const { level, progress } = this.calculateProgress(profile.xp);
                    this.tradeControl.setValue(profile.tradeUrl, { emitEvent: false });
                    return { ...profile, level, progress };
                })
            )
        )
    );

    constructor(
        private userDataService: UserDataService,
        private userProfileService: UserProfileService,
        private messageService: MessageService
    ) { }

    saveTradeUrl(): void {
        this.userData$.pipe(
            switchMap(data =>
                this.userProfileService.saveTradeUrl(data.steamid, this.tradeControl.value).pipe(
                    switchMap(() => this.userProfileService.getTradeUrl(data.steamid))
                )
            )
        ).subscribe({
            next: (res) => {
                this.tradeControl.setValue(res.tradeUrl, { emitEvent: false });
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Your trade url has been updated!',
                });
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Something went wrong.',
                });
            },
        });
    }

    private generateChips(steamId: string) {
        return [
            { label: 'Steam', link: `https://steamcommunity.com/profiles/${steamId}` },
            { label: 'Backpack.tf', link: `https://backpack.tf/profiles/${steamId}` },
            { label: 'Rep.tf', link: `https://rep.tf/${steamId}` },
        ];
    }

    private calculateProgress(xp: number): { level: number; progress: number } {
        for (let i = this.LEVELS.length - 1; i >= 0; i--) {
            if (xp >= this.LEVELS[i].xp) {
                const next = this.LEVELS[i + 1]?.xp;
                const progress = next != null
                    ? ((xp - this.LEVELS[i].xp) / (next - this.LEVELS[i].xp)) * 100
                    : 100;
                return { level: this.LEVELS[i].level, progress: Math.min(progress, 100) };
            }
        }
        return { level: 0, progress: 0 };
    }
}
