import { InjectionToken } from '@angular/core';

export const LOCAL_STORAGE_TOKEN = new InjectionToken<any>('local_storage', {
  providedIn: 'root',
  factory() {
    return localStorage;
  },
});
