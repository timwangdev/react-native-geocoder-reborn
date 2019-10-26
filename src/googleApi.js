const googleUrl = 'https://maps.google.com/maps/api/geocode/json';

function format(raw) {
  const address = {
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
    address.position = {
      lat: raw.geometry.location.lat,
      lng: raw.geometry.location.lng,
    }
  }

  raw.address_components.forEach(component => {
    if (component.types.indexOf('route') !== -1) {
      address.streetName = component.long_name;
    }
    else if (component.types.indexOf('street_number') !== -1) {
      address.streetNumber = component.long_name;
    }
    else if (component.types.indexOf('country') !== -1) {
      address.country = component.long_name;
      address.countryCode = component.short_name;
    }
    else if (component.types.indexOf('locality') !== -1) {
      address.locality = component.long_name;
    }
    else if (component.types.indexOf('postal_code') !== -1) {
      address.postalCode = component.long_name;
    }
    else if (component.types.indexOf('administrative_area_level_1') !== -1) {
      address.adminArea = component.long_name;
    }
    else if (component.types.indexOf('administrative_area_level_2') !== -1) {
      address.subAdminArea = component.long_name;
    }
    else if (component.types.indexOf('sublocality') !== -1 || component.types.indexOf('sublocality_level_1') !== -1) {
      address.subLocality = component.long_name;
    }
    else if (component.types.indexOf('point_of_interest') !== -1 || component.types.indexOf('colloquial_area') !== -1) {
      address.feature = component.long_name;
    }
  });

  return address;
}

export default {
  geocodePosition(apiKey, position, language = 'en') {
    if (!apiKey) {
      return Promise.reject(new Error("Invalid apiKey"));
    }
    if (!position || (!position.lat && position.lat!==0) || (!position.lng && position.lng!==0)) {
      return Promise.reject(new Error("Invalid position"));
    }

    return this.geocodeRequest(`${googleUrl}?key=${apiKey}&latlng=${position.lat},${position.lng}&language=${language}`);
  },

  geocodeAddress(apiKey, address, language = 'en') {
    if (!apiKey) {
      return Promise.reject(new Error("Invalid apiKey"));
    }
    if (!address) {
      return Promise.reject(new Error("Invalid address"));
    }

    return this.geocodeRequest(`${googleUrl}?key=${apiKey}&address=${encodeURI(address)}&language=${language}`);
  },

  async geocodeRequest(url) {
    const res = await fetch(url);
    const json = await res.json();

    if (!json.results || json.status !== 'OK') {
      throw new Error(`Geocoding error ${json.status}, ${json.error_message}`);
    }

    return json.results.map(format);
  }
}
