import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

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
export class ReleaseNotesComponent implements OnInit {
  http = inject(HttpClient);
  features: { icon: string; name: string; description: string }[] = [];

  releaseNotes: ReleaseNote[] = [];

  ngOnInit(): void {
    this.http.get<{ icon: string; name: string; description: string }[]>(`${environment.API_URL}/features`).subscribe((features) => {
      this.features = features;
    })
  }
}
