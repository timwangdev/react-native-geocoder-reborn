

# react-native-geocoder-reborn

[![CircleCI](https://circleci.com/gh/timwangdev/react-native-geocoder-reborn/tree/master.svg?style=shield)](https://circleci.com/gh/timwangdev/react-native-geocoder-reborn/tree/master)
[![npm](https://img.shields.io/npm/v/react-native-geocoder-reborn.svg)](https://www.npmjs.com/package/react-native-geocoder-reborn)
[![Downloads](https://img.shields.io/npm/dw/react-native-geocoder-reborn.svg)](https://www.npmjs.com/package/react-native-geocoder-reborn)

Geocoding services for react native.

The project is built on top of [devfd/react-native-geocoder](https://github.com/devfd/react-native-geocoder), due to original project is not likely being maintained. This fork should be a drop-in replacement. Some bug fixing and TypeScript support have being added.

## Version table
| Geocoder Version | RN        |
| ------- |:----------|
| >=0.7.0   | >= 0.56.0 |

If you're using an older version of react-native, please consider using [devfd/react-native-geocoder](https://github.com/devfd/react-native-geocoder) instead.

## Install
```
yarn add react-native-geocoder-reborn
```
or
```
npm install --save react-native-geocoder-reborn
```

## Link

### Autolinking with `react-native-cli` (require `react-native` 0.60 or above)

```bash
cd ios && pod install && cd .. # CocoaPods on iOS needs this extra step
# run with react-native-cli
yarn react-native run-ios
yarn react-native run-android
```

Please review [autolinking docs](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) for detials.

### Automatically
Run
```
react-native link react-native-geocoder-reborn
```

### Manually
If automatic linking fails you can follow the manual installation steps

#### iOS

1. In the XCode's "Project navigator", right click on Libraries folder under your project ➜ `Add Files to <...>`
2. Go to `node_modules` ➜ `react-native-geocoder-reborn` and add `ios/RNGeocoder.xcodeproj` file
3. Add libRNGeocoder.a to "Build Phases" -> "Link Binary With Libraries"

#### Android

1. In `android/setting.gradle` add:

```gradle
...
include ':react-native-geocoder-reborn', ':app'
project(':react-native-geocoder-reborn').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-geocoder-reborn/android')
```

3. In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    implementation project(':react-native-geocoder-reborn')
}
```

4. register module (in MainApplication.java)

```java
import com.devfd.RNGeocoder.RNGeocoderPackage; // <--- import

public class MainActivity extends ReactActivity {
  ......
  @Override
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNGeocoderPackage()     // <------ add this
        ); 
  }
  ......
}
```

## Usage
```js
import Geocoder from 'react-native-geocoder-reborn';

// Position Geocoding
var NY = {
  lat: 40.7809261,
  lng: -73.9637594
};

Geocoder.geocodePosition(NY).then(res => {
    // res is an Array of geocoding object (see below)
})
.catch(err => console.log(err))

// Address Geocoding
Geocoder.geocodeAddress('New York').then(res => {
    // res is an Array of geocoding object (see below)
})
.catch(err => console.log(err))
```

## Fallback to google maps geocoding

Geocoding services might not be included in some Android devices (Kindle, some 4.1 devices, non-google devices). For those special cases the lib can fallback to the [online google maps geocoding service](https://developers.google.com/maps/documentation/geocoding/intro#Geocoding)

```js
import Geocoder from 'react-native-geocoder-reborn';
// simply add your google key
Geocoder.fallbackToGoogle(MY_KEY);

// use the lib as usual
let ret = await Geocoder.geocodePosition({lat, lng})
// you get the same results

```

## With async / await
```js
try {
    const res = await Geocoder.geocodePosition(NY);
    ...
    const res = await Geocoder.geocodeAddress('London');
    ...
}
catch(err) {
    console.log(err);
}
```

## Geocoding object format
both iOS and Android will return the following object:

```js
{
    position: {lat, lng},
    formattedAddress: String, // the full address
    feature: String | null, // ex Yosemite Park, Eiffel Tower
    streetNumber: String | null,
    streetName: String | null,
    postalCode: String | null,
    locality: String | null, // city name
    country: String,
    countryCode: String
    adminArea: String | null
    subAdminArea: String | null,
    subLocality: String | null
}
```

## Notes

### iOS
iOS does not allow sending multiple geocoding requests simultaneously, hence if you send a second call, the first one will be cancelled.

### Android
geocoding may not work on older android devices (4.1) and will not work if Google play services are not available.


