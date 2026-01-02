import { Component, inject, OnInit } from '@angular/core';
import { UserProfileComponent } from './user-profile.component';
import { UserProfileFacade } from './user-profile.facade';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs';

@Component({
  selector: 'app-user-profile-container',
  imports: [UserProfileComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile-container.component.html',
})
export class UserProfileContainerComponent implements OnInit {
  facade = inject(UserProfileFacade);
  ngOnInit(): void {
    this.facade.userData$.pipe(take(1)).subscribe(userData => {
      this.facade.loadProfile(userData.steamid);
    });
  }
}
