import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

interface ReleaseNote {
  version: string;
  date: string;
  changes: string[];
  type: 'major' | 'minor' | 'patch';
}

@Component({
  selector: 'app-release-notes',
  imports: [CardModule, BadgeModule, ButtonModule],
  templateUrl: './release-notes.component.html',
  styleUrl: './release-notes.component.scss',
})
export class ReleaseNotesComponent {
  features = [
    { icon: 'pi pi-search', title: 'Advanced TF2 Search', desc: 'Filter by paint, quality, australium, killstreak' },
    { icon: 'pi pi-bell', title: 'Real-time Notifications', desc: 'Comment alerts via SignalR' },
    { icon: 'pi pi-users', title: 'User Profiles', desc: 'Steam integration + favorites' },
    { icon: 'pi pi-comments', title: 'Trade Comments', desc: 'Nested replies + notifications' },
    { icon: 'pi pi-star-fill', title: 'Follow Trades', desc: 'Get notified on your listings' },
    { icon: 'pi pi-chart-bar', title: 'Strange item stat histories', desc: 'Follow strange item statistics histories' },
    { icon: 'pi pi-cog', title: 'Modify Trades', desc: 'Customize your trade listings (visibility, notifications, edit)' },
    { icon: 'pi pi-search', title: 'Backpack.tf integration', desc: 'You can open item details on bp.tf with right click on item' },
  ];

  releaseNotes: ReleaseNote[] = [];
}
