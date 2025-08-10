import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Killstreaker } from '../../models/killstreaker.model';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  standalone: true,
    selector: 'item-killstreak',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectButtonModule],
    templateUrl: './item-killstreaker-selector.component.html',
    styleUrls: ['./item-killstreaker-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemKillstreakerSelectorComponent implements OnInit {
  @Input() killstreakControl!: FormControl<string>;
  @Output() selectionChange = new EventEmitter<{
    killstreaker: string;
    sheen: string;
    killstreak: string;
  }>();
  currentKillstreakData: Killstreaker = {
    killstreaker: '',
    sheen: '',
    killstreak: '',
  };

  killstreakers: string[] = [
    'Fire Horns',
    'Cerebral Discharge',
    'Tornado',
    'Flames',
    'Singularity',
    'Incinerator',
    'Hypno-Beam',
  ];

  sheens: string[] = [
    'Team Shine',
    'Deadly Daffodil',
    'Manndarin',
    'Mean Green',
    'Agonizing Emerald',
    'Villainous Violet',
    'Hot Rod',
  ];

  killstreaks: string[] = ['None', 'Standard', 'Specialized', 'Professional'];

  constructor() {}

  ngOnInit(): void {
    //this.currentKillstreakData = this.killstreakerControl.value;
    this.emitUpdatedKillstreakObject();
  }

  emitUpdatedKillstreakObject() {
    //this.killstreakerControl.patchValue(this.currentKillstreakData);
    this.selectionChange.emit(this.currentKillstreakData);
  }

  emitKillstreakValue(killstreak: string) {
    this.currentKillstreakData.killstreak =
      this.currentKillstreakData.killstreak === killstreak ? '' : killstreak;
    this.emitUpdatedKillstreakObject();
  }

  emitKillstreakerValue(killstreaker: string) {
    this.currentKillstreakData.killstreaker =
      this.currentKillstreakData.killstreaker === killstreaker
        ? ''
        : killstreaker;
    this.emitUpdatedKillstreakObject();
  }

  emitSheenValue(sheen: string) {
    
    this.emitUpdatedKillstreakObject();
  }
  
}
