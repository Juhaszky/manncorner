import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemCustomizerComponent } from '../../item-customizer/item-customizer.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'item-list-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-list-view.component.html',
  styleUrl: './item-list-view.component.scss',
})
export class ItemListViewComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  @Input() selectedItems: any;

  ngOnInit(): void {}
  removeSelectedItem(i: number) {
    this.selectedItems.splice(i, 1);
  }
  customizeSelectedItem(i: number) {
    const item = this.selectedItems[i];
    if (item) {
      const dialogRef = this.dialog.open(ItemCustomizerComponent, {
        data: { ...item },
        height: '70vh',
        width: '85vw',
      });
      dialogRef
        .afterClosed()
        .subscribe((modifiedData: { [key: string]: FormControl }) => {
          if (modifiedData) {
            const qualityControl = modifiedData['quality'];
            const effectControl = modifiedData['effect'];
            const nameControl = modifiedData['name'];

            if (qualityControl.value && effectControl.value && nameControl.value) {
              const quality = qualityControl.value;
              const effect = effectControl.value;
              const itemName = nameControl.value;

              item.quality = quality;
              item.effect = effect;
              item.originalName = item.name;
              item.name = `${itemName}`;
            }
          }
        });
    }
  }
}
