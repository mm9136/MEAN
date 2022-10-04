import { InjectionToken } from '@angular/core';

export const TOKEN_SESSION = new InjectionToken<Storage>(
  'Token',
  {
    providedIn: 'root',
    factory: () => localStorage
  }
);
