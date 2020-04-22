import { useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import Geocoder from './geocoder';
import { GeocodingObject, GeocoderOptions, Position } from './types';

export const useGeocodePosition = (
  position: Position,
  options: GeocoderOptions = {}
) => {
  let [geocodePositions, setGeocodePositions] = useState<GeocodingObject[]>([]);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<Error | null>(null);

  useDeepCompareEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let result = await Geocoder.geocodePosition(position);
        setGeocodePositions(result);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    })();
  }, [position, options]);

  return { result: geocodePositions, error, loading };
};

export const useGeocodeAddress = (
  address: string,
  options: GeocoderOptions = {}
) => {
  let [geocodePositions, setGeocodePositions] = useState<GeocodingObject[]>([]);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<Error | null>(null);

  useDeepCompareEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let result = await Geocoder.geocodeAddress(address, options);
        setGeocodePositions(result);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    })();
  }, [address, options]);

  return { result: geocodePositions, error, loading };
};
