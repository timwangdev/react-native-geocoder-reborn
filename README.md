# React Native Geocoder

Multi-platform Geocoding library for React Native apps.

[![CircleCI](https://circleci.com/gh/timwangdev/react-native-geocoder-reborn/tree/master.svg?style=shield)](https://circleci.com/gh/timwangdev/react-native-geocoder-reborn/tree/master)
[![npm](https://img.shields.io/npm/v/@timwangdev/react-native-geocoder.svg)](https://www.npmjs.com/package/@timwangdev/react-native-geocoder)

v1.x [![Downloads](https://img.shields.io/npm/dw/@timwangdev/react-native-geocoder.svg)](https://www.npmjs.com/package/@timwangdev/react-native-geocoder) / 
v0.x [![Downloads](https://img.shields.io/npm/dw/react-native-geocoder-reborn.svg)](https://www.npmjs.com/package/react-native-geocoder-reborn)


The project is originally forked from [devfd/react-native-geocoder](https://github.com/devfd/react-native-geocoder). Since 1.0 the project have been refactored and supports more features includes web support, maximum results limit, search boundary and request headers for Google Maps API.

> Note: This is a pre-release version.

> If you're looking for v0.x verison, please go to [v0.x branch](https://github.com/timwangdev/react-native-geocoder-reborn/tree/v0.x).

> **Please check the [GitHub Release page](https://github.com/timwangdev/react-native-geocoder-reborn/releases/) for Version 1.0.0 Full Changelog and Migration Guide. [WORKING IN PROGRESS]**

## Installation

```sh
npm install @timwangdev/react-native-geocoder
```

or

```sh
yarn add @timwangdev/react-native-geocoder
```

## Link

### Autolinking with `react-native-cli` (requires `react-native` 0.60 or above)

Please review [autolinking docs](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) for detials.

If "Autolinking" is not available for you, please try the following:

<details><summary>Use `react-native link`</summary>

```
react-native link @timwangdev/react-native-geocoder
```
</details>

<details><summary>Manually</summary>
If automatic linking fails you can follow the manual installation steps

#### iOS (With CocoaPods)

1. Add `pod 'react-native-geocoder', :path => '../node_modules/@timwangdev/react-native-geocoder/react-native-geocoder.podspec'` to your Podfile.
2. Run `pod install`.

#### iOS (Without CocoaPods)

1. In the XCode's "Project navigator", right click on Libraries folder under your project ➜ `Add Files to <...>`
2. Go to `node_modules` ➜ `@timwangdev/react-native-geocoder` and add `ios/RNGeocoder.xcodeproj` file
3. Add `libGeocoder.a` to "Build Phases" -> "Link Binary With Libraries"

#### Android

1. In `android/setting.gradle` add:

```gradle
...
include ':react-native-geocoder', ':app'
project(':react-native-geocoder').projectDir = new File(rootProject.projectDir, '../node_modules/@timwangdev/react-native-geocoder/android')
```

2. In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    implementation project(':react-native-geocoder')
}
```

3. Register module (in MainApplication.java)

```java
import com.timwangdev.reactnativegeocoder.GeocoderPackage; // <--- Add this line

public class MainActivity extends ReactActivity {
  ...
  @Override
  protected List<ReactPackage> getPackages() {
    ...
    packages.add(new GeocoderPackage()); // <--- Add this line

    return packages;
  }
  ...
}
```
</details>

## Usage

```js
import Geocoder from '@timwangdev/react-native-geocoder';

try {
  ...
  const position = { lat: 1.2, lng: -3.4 };
  await Geocoder.geocodePosition(position);
  ...
  await Geocoder.geocodeAddress('Paris', {
    locale: 'fr',
    maxResult: 2,
  });
  ...
} catch(err) {
  ...
}
```

### Geocode Address

* __`Geocoder.geocodeAddress(address: string, options?: GeocoderOptions)`__

  * Returns `Promise<GeocodingObject[]>`

  * Supports `regionIos` on iOS for preferred search boundary.

  * Supports `bounds` on Android and Google Maps API.

### Geocode Position (Reverse Geocoding)

* __`Geocoder.geocodePosition(position: { lat: number, lng: number }, options?: GeocoderOptions)`__

  * Returns `Promise<GeocodingObject[]>`

### `GeocoderOptions`

```typescript
{
  // Your Google Maps API key, required if `fallbackToGoogle` or `forceGoogleOnIos` is `true`.
  apiKey?: string;

  // Preferred Locale for outputs, defaults to 'en'. (See Note 1)
  locale?: string;

  // Max number of addresses to return, defaults to 2. (See Note 2)
  maxResults?: number;

  // (Android and Google only) Set the bounds for address geocoding. (See Note 3)
  bounds?: {
    // Lower left corner
    sw: { lat: number, lng: number },

    // Upper right corner
    ne: { lat: number, lng: number },
  };

  // (iOS native only) Set circular region for address geocoding. (See Note 3)
  regionIos?: {
    // Center of the circular region
    center: { lat: number, lng: number },

    // Radius of the circular region. Unit: km
    radius: number,
  };;

  // Should use Google Maps API if native query fails, defaults to false.
  fallbackToGoogle?: boolean;

  // Should always use Google Maps API on iOS, defaults to false. (See Note 4)
  forceGoogleOnIos?: boolean;
}
```
#### Notes:

1. Platforms may have different implantations for locale preference. Here is [Google Maps API supported language list](https://developers.google.com/maps/faq#languagesupport).

2. Generally, only one entry will return, though the geocoder may return several results when address queries are ambiguous. Smaller numbers (1 to 5) for `maxResults` are recommended.

2. On iOS the preferred search boundary for address geocoding only support "circular" region, while on Android and Google Maps API it using "rectangular" bounds. `regionIos` will have no effect if `forceGoogleOnIos` is `true`.

3. Use `forceGoogleOnIos` if you want consistent result on both iOS and Android platform, due to the limitation of iOS native implantation.

4. *REMOVED* <del>`requestHeaders` is useful together with Google API credentials restrictions by setting the `Referer` header. See [#20](https://github.com/timwangdev/react-native-geocoder-reborn/issues/20).</del>

5. In order to avoid hitting rate limit or reducing API queries, you should cache the results in your program whenever possible.

### `GeocodingObject`

```typescript
{
  position: { lat: number, lng: number };

  // The full formatted address
  formattedAddress: string;

  // Example: Yosemite Park, Eiffel Tower
  feature: string | null;

  streetNumber: string | null;

  streetName: string | null;

  postalCode: string | null;

  // City name
  locality: string | null;

  country: string;

  countryCode: string;

  adminArea: string | null;

  subAdminArea: string | null;

  subLocality: string | null;
}
```

## License

MIT
