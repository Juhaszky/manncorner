import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-item-effects',
  standalone: true,
  imports: [MatChipsModule, CommonModule,],
  templateUrl: './item-effects.component.html',
  styleUrl: './item-effects.component.scss'
})
export class ItemEffectsComponent {
  effects: string[] = ['spellbound', 'bonzo'];
  @Input() itemData: any;
  @Input() effectControl!: AbstractControl;
  @Output() selectionChange = new EventEmitter<string>();

  emitEffectValue(effect: string) {
    console.log(effect);
    this.effectControl.patchValue(effect);
    this.selectionChange.emit(effect);
  }
  initDefaultValue(effect: string): void {
    console.log(this.effectControl.value); 
    return this.effectControl?.value.includes(effect);
  }
  canSelect() {
    return this.effects.length === 1;
  }
}
