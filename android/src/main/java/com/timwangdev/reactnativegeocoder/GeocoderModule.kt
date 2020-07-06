package com.timwangdev.reactnativegeocoder

import android.location.Address;
import android.location.Geocoder;

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import java.util.Locale

class GeocoderModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  private var locale: Locale = Locale.getDefault()
  private var geocoder: Geocoder = Geocoder(getReactApplicationContext(), locale)

  override fun getName(): String {
    return "RNGeocoder"
  }

  @ReactMethod
  fun geocodeAddressAndroid(addressName: String, config: ReadableMap, promise: Promise) {
    val bounds: ReadableMap? = if (config.hasKey("bounds")) {
      config.getMap("bounds")
    } else null

    val swLat = bounds?.getDouble("swLat")
    val swLng = bounds?.getDouble("swLng")
    val neLat = bounds?.getDouble("neLat")
    val neLng = bounds?.getDouble("neLng")
    val localeStr = if (config.hasKey("locale")) config.getString("locale") else null

    if (localeStr != null && !locale.equals(Locale(localeStr))) {
      locale = Locale(localeStr)
      geocoder = Geocoder(getReactApplicationContext(), locale)
    }
    var maxResults = if (config.hasKey("maxResults")) config.getInt("maxResults") else -1
    if (maxResults <= 0) maxResults = 5
    try {
      val addresses: MutableList<Address>
      if (swLat != null && swLng != null && neLat != null && neLng != null) {
        addresses = geocoder.getFromLocationName(addressName, maxResults, swLat, swLng, neLat, neLng)
      } else {
        addresses = geocoder.getFromLocationName(addressName, maxResults)
      }
      if (addresses != null && addresses.size > 0) {
        promise.resolve(transform(addresses))
      } else {
        promise.reject("EMPTY_RESULT", "Geocoder returned an empty list.")
      }
    } catch (e: Exception) {
      promise.reject("NATIVE_ERROR", e)
    }
  }

  @ReactMethod
  fun geocodePositionAndroid(position: ReadableMap, config: ReadableMap, promise: Promise) {
    val localeStr = if (config.hasKey("locale")) config.getString("locale") else null
    if (localeStr != null && !locale.equals(Locale(localeStr))) {
      locale = Locale(localeStr)
      geocoder = Geocoder(getReactApplicationContext(), locale)
    }
    var maxResults = if (config.hasKey("maxResults")) config.getInt("maxResults") else -1
    if (maxResults <= 0) maxResults = 5;
    try {
      val addresses = geocoder.getFromLocation(position.getDouble("lat"), position.getDouble("lng"), maxResults)
      if (addresses != null && addresses.size > 0) {
        promise.resolve(transform(addresses))
      } else {
        promise.reject("EMPTY_RESULT", "Geocoder returned an empty list.")
      }
    } catch (e: Exception) {
      promise.reject("NATIVE_ERROR", e)
    }
  }

  internal fun transform(addresses: MutableList<Address>): WritableArray {
    val results = WritableNativeArray()
    for (address in addresses) {
      val result = WritableNativeMap()
      val position = WritableNativeMap()
      position.putDouble("lat", address.getLatitude())
      position.putDouble("lng", address.getLongitude())
      result.putMap("position", position)
      val feature_name = address.getFeatureName()
      if ((feature_name != null && feature_name != address.getSubThoroughfare() &&
          feature_name != address.getThoroughfare() &&
          feature_name != address.getLocality())) {
        result.putString("feature", feature_name)
      } else {
        result.putString("feature", null)
      }
      result.putString("locality", address.getLocality())
      result.putString("adminArea", address.getAdminArea())
      result.putString("country", address.getCountryName())
      result.putString("countryCode", address.getCountryCode())
      result.putString("locale", address.getLocale().toString())
      result.putString("postalCode", address.getPostalCode())
      result.putString("subAdminArea", address.getSubAdminArea())
      result.putString("subLocality", address.getSubLocality())
      result.putString("streetNumber", address.getSubThoroughfare())
      result.putString("streetName", address.getThoroughfare())
      val sb = StringBuilder()
      for (i in 0..address.getMaxAddressLineIndex()) {
        if (i > 0) {
          sb.append(", ")
        }
        sb.append(address.getAddressLine(i))
      }
      result.putString("formattedAddress", sb.toString())
      results.pushMap(result)
    }
    return results
  }
}
