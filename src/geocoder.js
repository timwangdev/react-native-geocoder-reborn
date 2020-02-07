import { NativeModules, Platform } from 'react-native';
import GoogleApi from './googleApi.js';

const { RNGeocoder } = NativeModules;

export default {

  apiKey: '',

  language: 'en',

  useGoogleOnIos: false,

  fallbackToGoogle(key) {
    this.apiKey = key;
  },

  forceGoogleOnIos(enable) {
    this.useGoogleOnIos = enable;
  },

  setLanguage(language) {
    this.language = language;
  },

  geocodePositionGoogle(position) {
    if (this.apiKey) {
      return GoogleApi.geocodePosition(this.apiKey, position, this.language);
    }

    // no API key - nothing we can do. We return a Promise (and reject it) because
    // the native modules also return a Promise.
    return Promise.reject();
  },

  geocodePosition(position) {
    if (!position || (!position.lat && position.lat!==0) || (!position.lng && position.lng!==0)) {
      return Promise.reject(new Error("Invalid position: {lat, lng} is required"));
    }

    if (this.useGoogleOnIos && this.apiKey && Platform.OS === 'ios') {
      // if we're on iOS and we've been told to use Google, then use Google
      return this.geocodePositionGoogle(position);
    }

    if (typeof RNGeocoder === 'undefined') {
      // if the RNGeocoder object is *not* defined, then try to use Google.
      // This happens if we're using this module with react-native-web, for example.
      return this.geocodePositionGoogle(position);
    }

    // finally, try to use the Native Geocoder object for this particular platform,
    // with a fallback to Google in case it fails.
    return RNGeocoder.geocodePosition(position, this.language).catch(err => {
      if (!this.apiKey) { throw err; }
      return this.geocodePositionGoogle(position);
    });
  },

  geocodeAddress(address) {
    if (!address) {
      return Promise.reject(new Error("Address is required"));
    }

    if (this.useGoogleOnIos && this.apiKey && Platform.OS === 'ios') {
      // if we're on iOS and we've been told to use Google, then use Google
      return this.geocodeAddressGoogle(address);
    }

    if (typeof RNGeocoder === 'undefined') {
      // if the RNGeocoder object is *not* defined, then try to use Google.
      // This happens if we're using this module with react-native-web, for example.
      return this.geocodeAddressGoogle(address);
    }

    // finally, try to use the Native Geocoder object for this particular platform,
    // with a fallback to Google in case it fails.
    return RNGeocoder.geocodeAddress(address, this.language).catch(err => {
      if (!this.apiKey) { throw err; }
      return this.geocodeAddressGoogle(address);
    });
  },


  geocodeAddressGoogle(address) {
    if (this.apiKey) {
      return GoogleApi.geocodeAddress(this.apiKey, address, this.language);
    }

    // no API key - nothing we can do. We return a Promise (and reject it) because
    // the native modules also return a Promise.
    return Promise.reject();
  }
}
