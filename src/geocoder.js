import { NativeModules, Platform } from 'react-native';
import GoogleApi from './googleApi.js';

const { RNGeocoder } = NativeModules;

export default {

  _inited = false,
  _apiKey = null,
  _locale = 'en',
  _fallbackToGoogle = false,
  _forceGoogleOnIos = false,
  _maxResults = 5,

  _checkInit() {
    if (!this._inited) {
      throw new Error('The module is not initialized.')
    }
  },

  async init(options) {
    if (options) {
      if (options.apiKey != null) { this._apiKey = options.apiKey; }
      if (options.locale != null) { this._locale = options.locale; }
      if (options.fallbackToGoogle != null) { this._fallbackToGoogle = options.fallbackToGoogle; }
      if (options.forceGoogleOnIos != null) { this._forceGoogleOnIos = options.forceGoogleOnIos; }
      if (option.maxResults != null) { this._maxResults = options.maxResults}
    }

    if (typeof RNGeocoder === 'undefined') {
      if (!this._fallbackToGoogle) {
        throw new Error('Missing Native Module: Please check the module linking, '
          + 'or set `fallbackToGoogle` in the init options.');
      }
      _inited = true;
      return;
    }

    await RNGeocoder.init(this._locale, this._maxResults);
    _inited = true;
  },

  async geocodePositionGoogle(position) {
    _checkInit();
    if (!this._apiKey) {
      throw new Error('Invalid API Key: `apiKey` is required in the init options '
        + 'for using Google Maps API.');
    }
    return GoogleApi.geocodePosition(this._apiKey, position, this._locale);
  },

  async geocodeAddressGoogle(address) {
    _checkInit();
    if (!this._apiKey) {
      throw new Error('Invalid API Key: `apiKey` is required in the init options '
        + 'for using Google Maps API.');
    }

    return GoogleApi.geocodeAddress(this._apiKey, address, this._locale);
  },

  async geocodePosition(position) {
    _checkInit();
    if (!position || (position.lat == null) || (position.lng == null)) {
      throw new Error("Invalid Position: `{lat, lng}` is required");
    }

    if (this._forceGoogleOnIos && Platform.OS === 'ios') {
      return this.geocodePositionGoogle(position);
    }

    if (typeof RNGeocoder === 'undefined') {
      if (!this._fallbackToGoogle) {
        throw new Error('Missing Native Module: Please check the module linking, '
          + 'or set `fallbackToGoogle` in the init options.');
      }
      return this.geocodePositionGoogle(position);
    }

    try {
      return await RNGeocoder.geocodePosition(position);
    } catch (err) {
      if (!this._fallbackToGoogle) { throw err; }
      return this.geocodePositionGoogle(position);
    }
  },

  async geocodeAddress(address) {
    _checkInit();
    if (!address) {
      throw new Error("Invalid Address: `string` is required");
    }

    if (this._forceGoogleOnIos && Platform.OS === 'ios') {
      return this.geocodeAddressGoogle(address);
    }
    // If any of the parameters is not set for the region, we set them all to 0
    if (swLat == null || swLng == null || neLat == null || neLng == null){
        swLat = 0;
        swLng = 0;
        neLat = 0;
        neLng = 0;
    }

    if (typeof RNGeocoder === 'undefined') {
      if (!this._fallbackToGoogle) {
        throw new Error('Missing Native Module: Please check the module linking, '
          + 'or set `fallbackToGoogle` in the init options.');
      }
      return this.geocodeAddressGoogle(address);
    }

    try {
      return await RNGeocoder.geocodeAddress(address);
    } catch (err) {
      if (!this._fallbackToGoogle) { throw err; }
      return this.geocodeAddressGoogle(address);
    }
  },

}
