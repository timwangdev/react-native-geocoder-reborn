import { Platform } from 'react-native';
import nativeImpl from './native';
import googleApi from './googleApi';
import { Position, GeocoderOptions, GeocodingObject } from './types';

let defaultOptions = {
  locale: 'en',
  fallbackToGoogle: false,
  forceGoogleOnIos: false,
  maxResults: 5,
};

function getApiKey(apiKey?: string) {
  if (!apiKey) {
    throw new Error(
      'Invalid API Key: `apiKey` is required for using Google Maps API.'
    );
  }
  return apiKey;
}

async function geocodePositionGoogle(
  position: Position,
  options: GeocoderOptions = {}
) {
  let apiKey = getApiKey(options.apiKey);
  let locale = options.locale || defaultOptions.locale;
  return googleApi.geocodePosition(apiKey, position, locale);
}

async function geocodeAddressGoogle(
  address: string,
  options: GeocoderOptions = {}
) {
  let apiKey = getApiKey(options.apiKey);
  let locale = options.locale || defaultOptions.locale;
  if (options.bounds) {
    // Use rectangle bounds for Google Maps api
    return googleApi.geocodeAddressWithBounds(
      apiKey,
      address,
      options.bounds,
      locale
    );
  }
  return googleApi.geocodeAddress(apiKey, address, locale);
}

async function geocodePosition(
  position: Position,
  options: GeocoderOptions = {}
): Promise<GeocodingObject[]> {
  if (!position || position.lat == null || position.lng == null) {
    throw new Error('Invalid Position: `{lat, lng}` is required');
  }

  if (options.forceGoogleOnIos && Platform.OS === 'ios') {
    return geocodePositionGoogle(position);
  }

  if (nativeImpl == null) {
    if (options.fallbackToGoogle) {
      return geocodePositionGoogle(position);
    }
    throw new Error(
      'Missing Native Module: Please check the module linking, ' +
        'or set `fallbackToGoogle` in the init options.'
    );
  }

  try {
    return await nativeImpl.geocodePosition(position);
  } catch (err) {
    if (options.fallbackToGoogle) {
      return geocodePositionGoogle(position, options);
    }
    throw new Error('Native Error: ' + err?.message || 'Unknown Execption.');
  }
}

async function geocodeAddress(
  address: string,
  options: GeocoderOptions = {}
): Promise<GeocodingObject[]> {
  let { bounds, regionIos } = options;
  if (!address) {
    throw new Error('Invalid Address: `string` is required');
  }

  if (options.forceGoogleOnIos && Platform.OS === 'ios') {
    return geocodeAddressGoogle(address);
  }

  if (nativeImpl == null) {
    if (options.fallbackToGoogle) {
      return geocodeAddressGoogle(address, options);
    }
    throw new Error(
      'Missing Native Module: Please check the module linking, ' +
        'or set `fallbackToGoogle` in the init options.'
    );
  }

  try {
    if (regionIos && Platform.OS === 'ios') {
      // Use round region query for iOS
      let { center, radius } = regionIos;
      return await nativeImpl.geocodeAddressInRegion(
        address,
        center.lat,
        center.lng,
        radius
      );
    } else if (bounds) {
      // Use rectangle bounds for Android
      let { sw, ne } = bounds;
      return await nativeImpl.geocodeAddressWithBounds(
        address,
        sw.lat,
        sw.lng,
        ne.lat,
        ne.lng
      );
    } else {
      // Normal query
      return await nativeImpl.geocodeAddress(address);
    }
  } catch (err) {
    if (options.fallbackToGoogle) {
      return geocodeAddressGoogle(address, options);
    }
    throw new Error('Native Error: ' + err?.message || 'Unknown Execption.');
  }
}

export default {
  geocodePosition,
  geocodePositionGoogle,
  geocodeAddress,
  geocodeAddressGoogle,
};
