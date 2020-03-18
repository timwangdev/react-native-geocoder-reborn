package com.reactnativecommunity.geocoder

import android.location.Address;
import android.location.Geocoder;

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.List;
import java.util.Locale;

class RNGeocoderModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val geocoder: Geocoder
    private val maxResults: Int = 5

    override fun getName(): String {
        return "RNGeocoder"
    }

    @ReactMethod
    fun init(locale: String, maxResults: Int) {
        geocoder = Geocoder(getReactApplicationContext(), Locale(locale))
        this.maxResults = maxResults
        if (!geocoder.isPresent()) {
            promise.reject("NOT_AVAILABLE", "Geocoder not available on this platform.")
        }
    }

    @ReactMethod
    fun geocodeAddress(addressName: String, promise: Promise) {
        try {
            val addresses = geocoder.getFromLocationName(addressName, maxResults)
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
    fun geocodeAddressInRegion(addressName: String, swLat: Float, swLng: Float, neLat: Float, neLng: Float, promise: Promise) {
        try {
            val addresses = geocoder.getFromLocationName(addressName, maxResults, swLat, swLng, neLat, neLng)
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
    fun geocodePosition(position: ReadableMap, language: String, promise: Promise) {
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

    internal fun transform(addresses: List<Address>): WritableArray {
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
