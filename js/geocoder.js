import { NativeModules } from 'react-native';
import GoogleApi from './googleApi.js';

const { RNGeocoder } = NativeModules;

export default {
  apiKey: null,

  language: 'en',

  fallbackToGoogle(key) {
    this.apiKey = key;
  },

  setLanguage(language) {
    this.language = language;
  },

  geocodePosition(position) {
    if (!position || (!position.lat && position.lat!==0) || (!position.lng && position.lng!==0)) {
      return Promise.reject(new Error("invalid position: {lat, lng} required"));
    }

    return RNGeocoder.geocodePosition(position, this.language).catch(err => {
      if (!this.apiKey) { throw err; }
      return GoogleApi.geocodePosition(this.apiKey, position, this.language);
    });
  },

  geocodeAddress(address) {
    if (!address) {
      return Promise.reject(new Error("address is null"));
    }

    return RNGeocoder.geocodeAddress(address).catch(err => {
      if (!this.apiKey) { throw err; }
      return GoogleApi.geocodeAddress(this.apiKey, address);
    });
  },
}
