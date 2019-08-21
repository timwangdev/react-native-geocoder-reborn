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

    export const apiKey: null | string;

    export function fallbackToGoogle(key: string): void;

    export function setLanguage(language: string): void;

    export function geocodePosition(position: Position): GeocodingObject[];

    export function geocodeAddress(address: string): GeocodingObject[];

    export = {
        apiKey,
        fallbackToGoogle,
        geocodePosition,
        geocodeAddress,
    }
}
