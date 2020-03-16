declare module "react-native-geocoder-reborn" {
  export interface Position {
    lat: number;
    lng: number;
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
    fallbackToGoogle?: boolean;
    forceGoogleOnIos?: boolean;
  }

  const Geocoder: {
    init: (options?: GeocoderOptions) => Promise<void>;
    geocodePosition: (position: Position) => Promise<GeocodingObject[]>;
    geocodeAddress: (address: string) => Promise<GeocodingObject[]>;
    geocodeAddressInRegion: (
      address: string,
      swLat: number,
      swLng: number,
      neLat: number,
      neLng: number
    ) => Promise<GeocodingObject[]>;
    geocodePositionGoogle: (position: Position) => Promise<GeocodingObject[]>;
    geocodeAddressGoogle: (address: string) => Promise<GeocodingObject[]>;
    geocodeAddressInRegionGoogle: (
      address: string,
      swLat: number,
      swLng: number,
      neLat: number,
      neLng: number
    ) => Promise<GeocodingObject[]>;
  };

  export default Geocoder;
}
