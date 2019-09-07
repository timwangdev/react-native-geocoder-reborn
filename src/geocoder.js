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

  geocodePosition(position) {
    if (!position || (!position.lat && position.lat!==0) || (!position.lng && position.lng!==0)) {
      return Promise.reject(new Error("Invalid position: {lat, lng} is required"));
    }

    if (this.useGoogleOnIos && this.apiKey && Platform.OS === 'ios') {
      return GoogleApi.geocodePosition(this.apiKey, position, this.language);
    }

    return RNGeocoder.geocodePosition(position, this.language).catch(err => {
      if (!this.apiKey) { throw err; }
      return GoogleApi.geocodePosition(this.apiKey, position, this.language);
    });
  },

  geocodeAddress(address, swLat, swLng, neLat, neLng) {
    if (!address) {
      return Promise.reject(new Error("Address is required"));
    }

    if (this.useGoogleOnIos && this.apiKey && Platform.OS === 'ios') {
      return GoogleApi.geocodeAddress(this.apiKey, address, this.language);
    }
    // If any of the parameters is not set for the region, we set them all to 0
    if (swLat == null || swLng == null || neLat == null || neLng == null){
        swLat = 0;
        swLng = 0;
        neLat = 0;
        neLng = 0;
    }

    return RNGeocoder.geocodeAddress(address, swLat, swLng, neLat, neLng, this.language).catch(err => {
      if (!this.apiKey) { throw err; }
      return GoogleApi.geocodeAddress(this.apiKey, address, this.language);
    });
  },
}
