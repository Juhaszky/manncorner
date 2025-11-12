import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpellFormGroup } from '../item-customizer.component';

@Component({
  selector: 'item-spells',
  imports: [SelectButton, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './item-spells.component.html',
  styleUrl: './item-spells.component.scss',
})
export class ItemSpellsComponent implements OnInit {
  @Input() spellFormGroup!: SpellFormGroup;
  spells: string[] = [];
  http = inject(HttpClient);

  ngOnInit(): void {
    this.http
      .get<string[]>(`${environment.MICROSERVICE_URL}/api/spells`)
      .subscribe(spells => (this.spells = spells));
  }
}
