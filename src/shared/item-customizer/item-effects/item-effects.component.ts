import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment.development';

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
  @Input() effectControl!: FormControl<number>;
  @Input() effectsControl!: FormControl<{ value: number , label: string }[]>;
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
  ngOnInit(): void {
    this.http
      .get<Record<number, string>>(`${environment.MICROSERVICE_URL}/api/effects`)
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
}
