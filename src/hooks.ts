import { useEffect, useState } from 'react';
import Geocoder from './geocoder';
import { Position, Bounds, GeocodingObject } from './types';

export const useGeocodePosition = (position: Position) => {
  let [geocodePositions, setGeocodePositions] = useState<GeocodingObject[]>([]);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let list = await Geocoder.geocodePosition(position);
        setGeocodePositions(list);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    })();
  }, [position]);

  return { list: geocodePositions, error, loading };
};

export const useGeocodeAddress = (address: string, bounds?: Bounds) => {
  let [geocodePositions, setGeocodePositions] = useState<GeocodingObject[]>([]);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let list = await Geocoder.geocodeAddress(address, bounds);
        setGeocodePositions(list);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    })();
  }, [address, bounds]);

  return { list: geocodePositions, error, loading };
};
