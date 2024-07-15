import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTimeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: number[] | string): string {
    if (!value) return '';

    let date: Date;
    if (Array.isArray(value)) {
      date = new Date(
        value[0],
        value[1] - 1,
        value[2],
        value[3],
        value[4],
        value[5]
      );
    } else {
      date = new Date(value);
    }

    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    if (seconds < 172800) return 'Yesterday';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';

    return date.toLocaleDateString();
  }
}
