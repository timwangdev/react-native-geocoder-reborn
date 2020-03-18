import { useEffect, useState } from 'react';
import Geocoder from './geocoder';
import { GeocodingObject } from './types';

export const useGeocodePosition = (lat: number, lng: number) => {
  let [geocodePositions, setGeocodePositions] = useState<GeocodingObject[]>([]);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let list = await Geocoder.geocodePosition({ lat, lng });
        setGeocodePositions(list);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    })();
  }, [lat, lng]);

  return { list: geocodePositions, error, loading };
};

export const useGeocodeAddress = (address: string) => {
  let [geocodePositions, setGeocodePositions] = useState<GeocodingObject[]>([]);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let list = await Geocoder.geocodeAddress(address);
        setGeocodePositions(list);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    })();
  }, [address]);

  return { list: geocodePositions, error, loading };
};

export const useGeocodeAddressWithBounds = (
  address: string,
  swLat: number,
  swLng: number,
  neLat: number,
  neLng: number
) => {
  let [geocodePositions, setGeocodePositions] = useState<GeocodingObject[]>([]);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let list = await Geocoder.geocodeAddress(address, {
          sw: { lat: swLat, lng: swLng },
          ne: { lat: neLat, lng: neLng },
        });
        setGeocodePositions(list);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    })();
  }, [address, swLat, swLng, neLat, neLng]);

  return { list: geocodePositions, error, loading };
};
