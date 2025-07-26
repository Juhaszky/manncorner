import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { filter, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-item-effects',
  imports: [CommonModule, SelectButton],
  templateUrl: './item-effects.component.html',
  styleUrl: './item-effects.component.scss',
})
export class ItemEffectsComponent implements OnInit {
  effects: { value: number, label: string }[] = [];
  filteredEffects: { value: number , label: string }[] = [];
  selectedEffect = -1;
  @Input() effectControl!: AbstractControl;
  @Output() selectionChange = new EventEmitter<number>();
  http = inject(HttpClient);
  ngOnInit(): void {
    this.http
      .get<Record<number, string>>(`http://localhost:3000/api/effects`)
      .pipe(
        map(
          effectsObj =>
            Object.entries(effectsObj)
              .filter(([key, value]) => /^[0-9]+$/.test(key))
              .map(([key, label]) => ({ value: Number(key), label}))
        )
      )
      .subscribe(filteredEffects => {
        this.effects = filteredEffects;
        this.filteredEffects = [...filteredEffects];
      });
  }
  isSelected(effect: string): boolean {
    return this.effectControl?.value.includes(effect);
  }
  canSelect() {
    return this.effects.length === 1;
  }
  onSearch(event: Event) {
    console.log('search ran');
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredEffects = this.effects.filter(effect => {
      return effect.label.toLowerCase().includes(value);
    });
  }
  onSelect(effect: {value: number; label: string}) {
    console.log(effect);
    if (effect) {
      this.effectControl.patchValue([effect]);
      this.selectedEffect = effect.value;
      this.selectionChange.emit(this.selectedEffect);
    } else {
      this.effectControl.patchValue([]);
      this.selectedEffect = -1
      this.selectionChange.emit(-1);
    }
  }
}
