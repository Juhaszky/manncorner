import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ErrorMessage } from '../shared/models/enums/error-message.enum';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private messageService: MessageService) {}
  handleError(error: unknown) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: ErrorMessage.UNAUTHORIZED,
        });
      }
    } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: ErrorMessage.UNKNOWN,
        });
    }
  }
}
