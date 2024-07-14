import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE_TOKEN } from './local-storage.token';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(@Inject(LOCAL_STORAGE_TOKEN) private localStorage: Storage) {}

  setItem(key: string, value: string): void {
    this.localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return this.localStorage.getItem(key);
  }

  removeItem(key: string): void {
    this.localStorage.removeItem(key);
  }

  clear(): void {
    this.localStorage.clear();
  }
}
