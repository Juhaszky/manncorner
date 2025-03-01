import { Component } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SortBarComponent } from './sort-bar/sort-bar.component';

@Component({
    selector: 'app-action-bar',
    imports: [SearchBarComponent, SortBarComponent],
    templateUrl: './action-bar.component.html',
    styleUrl: './action-bar.component.scss'
})
export class ActionBarComponent {}
