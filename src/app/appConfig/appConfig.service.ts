import { InjectionToken } from '@angular/core';
import { vars } from '../../environment/api.config';

export interface AppConfig {
  endPoint: string;
  accessKey: string;
  accessToken: string;
  imageBaseUrl: string;
}

export const APP_CONFIG_SERVICE = new InjectionToken<AppConfig>('app.config');

export const APP_CONFIG: AppConfig = {
  endPoint: vars.endPoint,
  accessKey: vars.accessKey,
  accessToken: vars.accessToken,
  imageBaseUrl: vars.imageBaseUrl,
};
