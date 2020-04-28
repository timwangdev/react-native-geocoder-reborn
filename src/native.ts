import { NativeModules } from 'react-native';
import { GeocodingObject, Position, GeocoderOptions } from './types';

const { RNGeocoder: nativeGeocoder } = NativeModules;

interface NativeImpl {
  geocodePosition: (
    position: Position,
    locale: string,
    maxResult: number
  ) => Promise<GeocodingObject[]>;

  geocodeAddress: (
    address: string,
    locale: string,
    maxResult: number
  ) => Promise<GeocodingObject[]>;

  geocodeAddressInRegion: (
    address: string,
    lat: number,
    lng: number,
    radius: number,
    locale: string,
    maxResult: number
  ) => Promise<GeocodingObject[]>;

  geocodePositionAndroid: (
    position: Position,
    config: GeocoderOptions
  ) => Promise<GeocodingObject[]>;

  geocodeAddressAndroid: (
    address: string,
    config: GeocoderOptions
  ) => Promise<GeocodingObject[]>;
}

export default nativeGeocoder as NativeImpl;
