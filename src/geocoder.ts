import { Platform } from 'react-native';
import nativeImpl from './native';
import googleApi from './googleApi';
import { Position, GeocoderOptions, GeocodingObject } from './types';

let defaultOptions = {
  locale: 'en',
  fallbackToGoogle: false,
  forceGoogleOnIos: false,
  maxResults: 2,
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
  let headers = options.requestHeaders;
  return googleApi.geocodePosition(apiKey, position, locale, headers);
}

async function geocodeAddressGoogle(
  address: string,
  options: GeocoderOptions = {}
) {
  let apiKey = getApiKey(options.apiKey);
  let locale = options.locale || defaultOptions.locale;
  let headers = options.requestHeaders;
  if (options.bounds) {
    // Use rectangle bounds for Google Maps api
    return googleApi.geocodeAddressWithBounds(
      apiKey,
      address,
      options.bounds,
      locale,
      headers
    );
  }
  return googleApi.geocodeAddress(apiKey, address, locale, headers);
}

async function geocodePosition(
  position: Position,
  options: GeocoderOptions = {}
): Promise<GeocodingObject[]> {
  if (!position || position.lat == null || position.lng == null) {
    throw new Error('Invalid Position: `{lat, lng}` is required');
  }

  if (options.forceGoogleOnIos && Platform.OS === 'ios') {
    return geocodePositionGoogle(position, options);
  }

  if (nativeImpl == null) {
    if (options.fallbackToGoogle) {
      return geocodePositionGoogle(position, options);
    }
    throw new Error(
      'Missing Native Module: Please check the module linking, ' +
        'or set `fallbackToGoogle` in the init options.'
    );
  }

  try {
    if (Platform.OS === 'android') {
      return await nativeImpl.geocodePositionAndroid(position, options);
    } else {
      return await nativeImpl.geocodePosition(
        position,
        options.locale || defaultOptions.locale,
        options.maxResults || defaultOptions.maxResults
      );
    }
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
  if (!address) {
    throw new Error('Invalid Address: `string` is required');
  }

  if (options.forceGoogleOnIos && Platform.OS === 'ios') {
    return geocodeAddressGoogle(address, options);
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
    if (Platform.OS === 'ios' && options.regionIos) {
      // Use round region query for iOS
      let { center, radius } = options.regionIos;
      return await nativeImpl.geocodeAddressInRegion(
        address,
        center.lat,
        center.lng,
        radius,
        options.locale || defaultOptions.locale,
        options.maxResults || defaultOptions.maxResults
      );
    } else if (Platform.OS === 'android') {
      return await nativeImpl.geocodeAddressAndroid(address, options);
    } else {
      return await nativeImpl.geocodeAddress(
        address,
        options.locale || defaultOptions.locale,
        options.maxResults || defaultOptions.maxResults
      );
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
