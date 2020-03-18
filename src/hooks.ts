import { useEffect, useState } from 'react';
import Geocoder from './geocoder';
import { Position, Bounds, GeocodingObject } from './types';

export const useGeocodePosition = (position: Position) => {
  const [geocodePositions, setGeocodePositions] = useState<GeocodingObject[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await Geocoder.geocodePosition(position);
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
  const [geocodePositions, setGeocodePositions] = useState<GeocodingObject[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await Geocoder.geocodeAddress(address, bounds);
        setGeocodePositions(list);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    })();
  }, [address, bounds]);

  return { list: geocodePositions, error, loading };
};
