import { Component, inject } from '@angular/core';
import { UserProfileComponent } from './user-profile.component';
import { UserProfileFacade } from './user-profile.facade';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile-container',
  imports: [UserProfileComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile-container.component.html'
})
export class UserProfileContainerComponent {
  facade = inject(UserProfileFacade);
}
