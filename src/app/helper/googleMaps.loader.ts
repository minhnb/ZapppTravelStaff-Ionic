import { AppConfig } from '../app.config';

import * as googleMapsLoader from 'google-maps';
googleMapsLoader.KEY = AppConfig.GOOGLE_API_KEY;

export const GoogleMapsLoader = googleMapsLoader;
