import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../environments/environment.development';

export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  dataJson: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private hubConnection?: HubConnection;
  unreadCount$ = new BehaviorSubject<number>(0);
  notifications$ = new BehaviorSubject<Notification[]>([]);

  readonly _unreadCount$ = this.unreadCount$.asObservable();
  readonly _notifications$ = this.notifications$.asObservable();

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  async connect(steamId: string): Promise<void> {
    if (this.hubConnection?.state === 'Connected') return;
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.API_URL}/notificationHub`, {
        withCredentials: true,
        skipNegotiation: false,
      })
      .build();

    this.hubConnection.on(
      'ReceiveNotification',
      (notification: Notification) => {
        const current = this.notifications$.value;
        this.notifications$.next([notification, ...current]);
        this.unreadCount$.next(this.unreadCount$.value + 1);

        this.messageService.add({
          severity: 'info',
          summary: notification.title,
          detail: notification.message,
        });
      }
    );

    await this.hubConnection.start();
    await this.hubConnection.invoke('JoinUserGroup', steamId);
  }

  markAsRead(id: number): void {
    this.http.delete(`${environment.API_URL}/api/notifications/${id}`).subscribe({
      complete: () => {
        const current = this.notifications$.value;
        this.notifications$.next(
          current.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
        this.unreadCount$.next(Math.max(0, this.unreadCount$.value - 1));
      },
    });
  }
  markAsReadAll(): void {
    this.http.delete(`${environment.API_URL}/api/Notifications/clear-all`).subscribe({
      complete: () => {
        const current = this.notifications$.value;
        this.notifications$.next(
          current.map(n => ({ ...n, isRead: true }))
        );
        this.unreadCount$.next(Math.max(0, this.unreadCount$.value - 1));
        this.notifications$.next([]);
      },
    });
  }

  loadUnread(): void {
    this.http.get<Notification[]>(`${environment.API_URL}/api/Notifications/unread`, { withCredentials: true }).subscribe({
      next: notifs => {
        this.notifications$.next(notifs);
        this.unreadCount$.next(notifs.filter(n => !n.isRead).length);
      },
    });
  }
}
