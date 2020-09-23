import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  Button,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { geocoder as conf } from '../env.json';
import Geocoder from '../..';

export default function App() {
  let [lat, setLat] = React.useState('');
  let [lng, setLng] = React.useState('');
  let [addr, setAddr] = React.useState('');
  let [swLat, setSwLat] = React.useState('');
  let [swLng, setSwLng] = React.useState('');
  let [neLat, setNeLat] = React.useState('');
  let [neLng, setNeLng] = React.useState('');
  let [cLat, setCLat] = React.useState('');
  let [cLng, setCLng] = React.useState('');
  let [radius, setRadius] = React.useState('');
  let [result, setResult] = React.useState(null);
  let [error, setError] = React.useState(null);

  function geocodePosition() {
    setResult(null);
    setError(null);
    Geocoder.geocodePosition(
      {
        lat: Number(lat),
        lng: Number(lng),
      },
      conf
    )
      .then(setResult)
      .catch(e => {
        setError(e && e.message);
        console.warn(e);
      });
  }

  function geocodeAddress() {
    setResult(null);
    setError(null);
    let bounds =
      swLat === ''
        ? undefined
        : {
            sw: { lat: Number(swLat), lng: Number(swLng) },
            ne: { lat: Number(neLat), lng: Number(neLng) },
          };
    let regionIos =
      cLat === ''
        ? undefined
        : {
            center: { lat: Number(cLat), lng: Number(cLng) },
            radius: Number(radius),
          };
    Geocoder.geocodeAddress(addr, { ...conf, bounds, regionIos })
      .then(setResult)
      .catch(e => {
        setError(e && e.message);
        console.warn(e);
      });
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <SafeAreaView>
        <View style={styles.container}>
          <Text>Input Latitude</Text>
          <TextInput style={styles.input} value={lat} onChangeText={setLat} />
          <Text>Input Longitude</Text>
          <TextInput style={styles.input} value={lng} onChangeText={setLng} />
          <Button title="Geocode Position" onPress={geocodePosition} />
          <Text>Input Address</Text>
          <TextInput style={styles.input} value={addr} onChangeText={setAddr} />
          <Text>Input South Bound Latitude</Text>
          <TextInput
            style={styles.input}
            value={swLat}
            onChangeText={setSwLat}
          />
          <Text>Input West Bound Longitude</Text>
          <TextInput
            style={styles.input}
            value={swLng}
            onChangeText={setSwLng}
          />
          <Text>Input North Bound Latitude</Text>
          <TextInput
            style={styles.input}
            value={neLat}
            onChangeText={setNeLat}
          />
          <Text>Input East Bound Longitude</Text>
          <TextInput
            style={styles.input}
            value={neLng}
            onChangeText={setNeLng}
          />
          <Text>Input Center Latitude</Text>
          <TextInput style={styles.input} value={cLat} onChangeText={setCLat} />
          <Text>Input Center Longitude</Text>
          <TextInput style={styles.input} value={cLng} onChangeText={setCLng} />
          <Text>Input Search Radius (km)</Text>
          <TextInput
            style={styles.input}
            value={radius}
            onChangeText={setRadius}
          />
          <Button title="Geocode Address" onPress={geocodeAddress} />
          <Text>Success Output:</Text>
          <Text style={styles.resText}>
            {JSON.stringify(result, undefined, 2)}
          </Text>
          <Text>Error Output:</Text>
          <Text style={styles.errText}>
            {JSON.stringify(error, undefined, 2)}
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    padding: 8,
    marginVertical: 8,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  resText: {
    padding: 8,
    backgroundColor: '#ccffcc',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  errText: {
    padding: 8,
    backgroundColor: '#ffcccc',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
});
