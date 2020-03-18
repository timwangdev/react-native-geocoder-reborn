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
import Geocoder from '../..';

export default function App() {
  let [lat, setLat] = React.useState('');
  let [lng, setLng] = React.useState('');
  let [addr, setAddr] = React.useState('');
  let [swLat, setSwLat] = React.useState('');
  let [swLng, setSwLng] = React.useState('');
  let [neLat, setNeLat] = React.useState('');
  let [neLng, setNeLng] = React.useState('');
  let [result, setResult] = React.useState({});
  let [error, setError] = React.useState({});

  function geocodePosition() {
    setResult('');
    setError('');
    Geocoder.geocodePosition({
      lat: Number(lat),
      lng: Number(lng),
    })
      .then(setResult)
      .catch(setError);
  }

  function geocodeAddress() {
    setResult('');
    setError('');
    let bounds =
      swLat === ''
        ? undefined
        : {
            sw: { lat: Number(swLat), lng: Number(swLng) },
            ne: { lat: Number(neLat), lng: Number(neLng) },
          };
    Geocoder.geocodeAddress(addr, bounds)
      .then(setResult)
      .catch(setError);
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
          <Button title="Geocode Address" onPress={geocodeAddress} />
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
  },
  resText: {
    backgroundColor: '#ccffcc',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  errText: {
    backgroundColor: '#ffcccc',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
});
