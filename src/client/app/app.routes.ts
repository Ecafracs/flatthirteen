import { provideRouter, RouterConfig } from '@angular/router';

import { AboutRoutes } from './+about/index';
import { HomeRoutes } from './+home/index';
import { PlayRoutes } from './+play/index';

const routes: RouterConfig = [
  ...HomeRoutes,
  ...PlayRoutes,
  ...AboutRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
];
