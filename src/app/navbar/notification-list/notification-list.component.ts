import { Popover, PopoverModule } from "primeng/popover";
import { Notification, NotificationService } from "../../notification.service";
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, ButtonModule, PopoverModule, FormsModule],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
})
export class NotificationListComponent {
  @Input() popOverEl!: Popover;
  
  readonly notifications$ = this.notificationService.notifications$;
  readonly unreadCount$ = this.notificationService.unreadCount$;
  
  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  openPanel(event: Event) {
    this.popOverEl.show(event);
  }
  onClosePanel() {
    this.popOverEl.hide();
  }
  onNotificationClick(notif: Notification) {
    this.notificationService.markAsRead(notif.id);
    
    try {
      const data = JSON.parse(notif.dataJson || '{}');
      if (data.tradeId) {
        this.router.navigate(['/trade', data.tradeId]);
      } else {
        this.router.navigate(['/notifications']);
      }
    } catch {
      this.router.navigate(['/notifications']);
    }
  }

  clearAll() {
    this.notificationService.markAsReadAll();
  }

  trackById(index: number, notif: Notification): number {
    return notif.id;
  }
}
