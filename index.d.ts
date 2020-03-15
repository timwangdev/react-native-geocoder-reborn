declare module 'react-native-geocoder-reborn' {

    export interface Position {
        lat: number;
        lng: number;
    }

    export interface GeocodingObject {
        position: Position,
        formattedAddress: string, // the full address
        feature: string | null, // ex Yosemite Park, Eiffel Tower
        streetNumber: string | null,
        streetName: string | null,
        postalCode: string | null,
        locality: string | null, // city name
        country: string,
        countryCode: string
        adminArea: string | null
        subAdminArea: string | null,
        subLocality: string | null
    }

    export interface GeocoderOptions {
        apiKey?: string | null;
        locale?: string;
        fallbackToGoogle?: boolean;
        forceGoogleOnIos?: boolean;
    }

    const Geocoder: {
        init: (options?: GeocoderOptions) => Promise<void>;
        geocodePosition: (position: Position) => Promise<GeocodingObject[]>,
        geocodeAddress: (address: string) => Promise<GeocodingObject[]>,
        geocodePositionGoogle: (position: Position) => Promise<GeocodingObject[]>,
        geocodeAddressGoogle: (address: string) => Promise<GeocodingObject[]>,
    }

    export default Geocoder;
}
