import { Position, Bounds, GeocodingObject, RequestHeaders } from './types';

const GOOGLE_URL = 'https://maps.google.com/maps/api/geocode/json';

async function geocodeRequest(url: string, headers?: RequestHeaders) {
  let res = await fetch(url, { headers });
  let json = await res.json();

  if (!json.results || json.status !== 'OK') {
    throw new Error(
      `Google Maps Error: [${json.status}] ${json.error_message}`
    );
  }
  return json.results.map(format) as GeocodingObject[];
}

function format(raw: any) {
  const geocodeObj = {
    position: {},
    formattedAddress: raw.formatted_address || '',
    feature: null,
    streetNumber: null,
    streetName: null,
    postalCode: null,
    locality: null,
    country: null,
    countryCode: null,
    adminArea: null,
    subAdminArea: null,
    subLocality: null,
  };

  if (raw.geometry && raw.geometry.location) {
    geocodeObj.position = {
      lat: raw.geometry.location.lat,
      lng: raw.geometry.location.lng,
    };
  }

  raw.address_components.forEach((component: any) => {
    if (component.types.indexOf('route') !== -1) {
      geocodeObj.streetName = component.long_name;
    } else if (component.types.indexOf('street_number') !== -1) {
      geocodeObj.streetNumber = component.long_name;
    } else if (component.types.indexOf('country') !== -1) {
      geocodeObj.country = component.long_name;
      geocodeObj.countryCode = component.short_name;
    } else if (component.types.indexOf('locality') !== -1) {
      geocodeObj.locality = component.long_name;
    } else if (component.types.indexOf('postal_code') !== -1) {
      geocodeObj.postalCode = component.long_name;
    } else if (component.types.indexOf('administrative_area_level_1') !== -1) {
      geocodeObj.adminArea = component.long_name;
    } else if (component.types.indexOf('administrative_area_level_2') !== -1) {
      geocodeObj.subAdminArea = component.long_name;
    } else if (
      component.types.indexOf('sublocality') !== -1 ||
      component.types.indexOf('sublocality_level_1') !== -1
    ) {
      geocodeObj.subLocality = component.long_name;
    } else if (
      component.types.indexOf('point_of_interest') !== -1 ||
      component.types.indexOf('colloquial_area') !== -1
    ) {
      geocodeObj.feature = component.long_name;
    }
  });

  return geocodeObj;
}

export default {
  geocodePosition(
    apiKey: string,
    position: Position,
    language: string,
    headers?: RequestHeaders
  ) {
    return geocodeRequest(
      `${GOOGLE_URL}?key=${apiKey}&latlng=${position.lat},${position.lng}&language=${language}`,
      headers
    );
  },

  geocodeAddress(
    apiKey: string,
    address: string,
    language: string,
    headers?: RequestHeaders
  ) {
    return geocodeRequest(
      `${GOOGLE_URL}?key=${apiKey}&address=${encodeURI(
        address
      )}&language=${language}`,
      headers
    );
  },

  geocodeAddressWithBounds(
    apiKey: string,
    address: string,
    bounds: Bounds,
    language: string,
    headers?: RequestHeaders
  ) {
    let { sw, ne } = bounds;
    return geocodeRequest(
      `${GOOGLE_URL}?key=${apiKey}&address=${encodeURI(address)}` +
        `&bounds=${sw.lat},${sw.lng}|${ne.lat},${ne.lng}&language=${language}`,
      headers
    );
  },
};
