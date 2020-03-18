export interface Position {
  lat: number;
  lng: number;
}

export interface Bounds {
  sw: Position;
  ne: Position;
}

export interface GeocodingObject {
  position: Position;

  // The full formatted address
  formattedAddress: string;

  // Example: Yosemite Park, Eiffel Tower
  feature: string | null;

  streetNumber: string | null;

  streetName: string | null;

  postalCode: string | null;

  // City name
  locality: string | null;

  country: string;

  countryCode: string;

  adminArea: string | null;

  subAdminArea: string | null;

  subLocality: string | null;
}

export interface GeocoderOptions {
  apiKey?: string | null;
  locale?: string;
  maxResults?: number;
  fallbackToGoogle?: boolean;
  forceGoogleOnIos?: boolean;
}
