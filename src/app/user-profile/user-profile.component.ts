import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { UserDataService } from '../../shared/user-data.service';
import { filter, Observable, switchMap } from 'rxjs';
import { UserData } from '../../shared/models/userdata.model';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ProgressBarModule,
    ToastModule,
    ChipModule,
    InputTextModule,
    FloatLabel,
    ButtonModule,
    FormsModule,
  ],
  providers: [MessageService],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  userService = inject(UserDataService);
  messageService = inject(MessageService);
  httpClient = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
  userData!: UserData | null;
  chipData: { label: string; link: string }[] = [];
  tradeUrl = '';
  value = 50;
  ngOnInit(): void {
    this.userService.userData$
      .pipe(
        filter(data => !!data),
        switchMap(data => {
          this.userData = data;
          this.chipData = [
            {
              label: 'Steam',
              link: data?.steamid
                ? `https://steamcommunity.com/profiles/${data.steamid}`
                : '',
            },
            {
              label: 'Backpack.tf',
              link: data?.steamid
                ? `https://backpack.tf/profiles/${data.steamid}`
                : '',
            },
            {
              label: 'Rep.tf',
              link: data?.steamid ? `https://rep.tf/${data.steamid}` : '',
            },
          ].filter(chip => !!chip.link);

          // Ensure steamId exists before calling getTradeUrl
          if (!data?.steamid) {
            //throw new Error('No Steam ID found in user data');
          }

          return this.getTradeUrl(); // return observable here
        })
      )
      .subscribe({
        next: (tradeUrl: {
          id: number;
          steamId: string;
          tradeUrl: string;
          xp: number;
        }) => {
          this.tradeUrl = tradeUrl.tradeUrl ?? '';
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Error fetching trade URL:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not fetch trade URL.',
          });
        },
      });
  }

  onSaveTradeUrl(): void {
    this.saveTradeUrl().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Your trade url has been set correctly!',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong with setting your tradeUrl!',
        });
      },
    });
  }

  getTradeUrl() {
    const steamId = this.userData?.steamid;
    const url = `https://localhost:7221/api/User/${steamId}`;
    return this.httpClient.get<{
      id: number;
      steamId: string;
      tradeUrl: string;
      xp: number;
    }>(url);
  }

  private saveTradeUrl(): Observable<string> {
    const steamId = this.userData?.steamid;
    const url = `https://localhost:7221/api/user/${steamId}/tradeurl`;
    const params = { tradeUrl: this.tradeUrl };

    return this.httpClient.put(url, null, {
      params,
      responseType: 'text',
    });
  }
}
