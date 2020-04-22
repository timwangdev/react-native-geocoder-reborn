import { NativeModules } from 'react-native';
import { GeocodingObject, Position } from './types';

const { RNGeocoder: nativeGeocoder } = NativeModules;

interface NativeImpl {
  init: (locale: string, maxResults: number) => Promise<void>;
  geocodePosition: (position: Position) => Promise<GeocodingObject[]>;
  geocodeAddress: (address: string) => Promise<GeocodingObject[]>;
  geocodeAddressWithBounds: (
    address: string,
    swLat: number,
    swLng: number,
    neLat: number,
    neLng: number
  ) => Promise<GeocodingObject[]>;
  geocodeAddressInRegion: (
    address: string,
    lat: number,
    lng: number,
    radius: number
  ) => Promise<GeocodingObject[]>;
}

export default nativeGeocoder as NativeImpl;
