import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-item-effects',
  imports: [CommonModule, SelectButton, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './item-effects.component.html',
  styleUrl: './item-effects.component.scss',
})
export class ItemEffectsComponent implements OnInit {
  effects: { value: number, label: string }[] = [];
  filteredEffects: { value: number , label: string }[] = [];
  selectedEffect = -1;
  @Input() effectControl!: FormControl<number>;
  @Input() effectsControl!: FormControl<{ value: number , label: string }[]>;
  @Output() selectionChange = new EventEmitter<number>();
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
  ngOnInit(): void {
    this.http
      .get<Record<number, string>>(`http://localhost:3000/api/effects`)
      .pipe(
        map(
          effectsObj =>
            Object.entries(effectsObj)
              .filter(([key]) => /^[0-9]+$/.test(key))
              .map(([key, label]) => ({ value: Number(key), label}))
        )
      )
      .subscribe(filteredEffects => {
        this.effects = filteredEffects;
        this.effectsControl.setValue(filteredEffects);
        this.filteredEffects = [...filteredEffects];
        this.cdr.detectChanges();
      });
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
      this.effectControl.patchValue(effect.value);
      this.selectedEffect = effect.value;
      this.selectionChange.emit(this.selectedEffect);
    } else {
      this.effectControl.patchValue(-1);
      this.selectedEffect = -1
      this.selectionChange.emit(-1);
    }
  }
}
