import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  requestCount = 0;

  constructor() {}

  addRequest() {
    this.requestCount++;
  }

  removeRequest() {
    this.requestCount--;
  }
}
