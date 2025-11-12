import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postDate',
  standalone: true,
})
export class PostDatePipe implements PipeTransform {
  transform(value: Date): string {
    const now = Date.now();
    const postDate = new Date(value).getTime();
    const time = (now - postDate) / 60000; //ms to minutes

    if (time < 1) {
      return `(${Math.floor(time * 60).toFixed()} seconds ago)`;
    } else if (time < 60) {
      return `(${Math.floor(time)} minutes ago)`;
    } else if (time < 1440) {
      return `(${Math.floor(time / 60)} hours ago)`;
    } else {
      return '(Long time ago...)';
    }
  }
}
