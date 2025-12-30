import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileData } from '../../shared/models/ProfileData';
import { UserData } from '../../shared/models/userdata.model';
import { HttpClient } from '@angular/common/http';
import { StrangeItemHistoriesComponent } from './strange-item-histories/strange-item-histories.component';
import { FavouriteCollectionComponent } from './favourite-collection/favourite-collection.component';
import { ItemContainerComponent } from '../../shared/item/item-container.component';
import { Item } from '../../shared/models/item.model';
@Component({
  selector: 'app-user-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ProgressBarModule,
    ToastModule,
    ChipModule,
    InputTextModule,
    FloatLabel,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    StrangeItemHistoriesComponent,
    FavouriteCollectionComponent,
    ItemContainerComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  @Input() profileData!: ProfileData | null;
  @Input() userData!: UserData | null;
  @Input() chipData: { label: string, link: string }[] = [];
  @Input() tradeControl!: FormControl;

  @Output() saveTradeUrl = new EventEmitter<void>();
  @Output() deleteFavouriteItem = new EventEmitter<Item>();
  http = inject(HttpClient);

  openLink(url: string): void {
    window.open(url, '_blank');
  }
  removeItem(item: Item) {
    this.deleteFavouriteItem.emit(item);
  }
}