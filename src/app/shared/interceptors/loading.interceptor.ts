import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading/loading.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.addRequest();

  return next(req).pipe(
    delay(200), // delay for 200ms
    finalize(() => {
      loadingService.removeRequest();
    })
  );
};
