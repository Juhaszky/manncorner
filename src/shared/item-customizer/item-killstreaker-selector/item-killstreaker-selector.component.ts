import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { KillstreakFormGroup } from '../item-customizer.component';
import { KILLSTREAK_TIERS, KILLSTREAKERS, SHEENS } from '../../killstreak.constants';

@Component({
  standalone: true,
  selector: 'item-killstreak',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectButtonModule],
  templateUrl: './item-killstreaker-selector.component.html',
  styleUrls: ['./item-killstreaker-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemKillstreakerSelectorComponent {
  @Input() killstreakFormGroup!: KillstreakFormGroup;

  killstreaks = [...KILLSTREAK_TIERS];
  killstreakers = [...KILLSTREAKERS];
  sheens = [...SHEENS];
}
