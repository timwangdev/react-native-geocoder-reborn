import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
  Platform,
} from 'react-native';
import Geocoder from 'react-native-geocoder-reborn';

class App extends React.Component {

  state = {
    addressInput: '',
    latInput: '',
    lngInput: '',
    addressObj: {},
    errObj: {},
  }

  geocodePosition = () => {
    Geocoder.geocodePosition({ lat: Number(this.state.latInput), lng: Number(this.state.lngInput)})
      .then(res => this.setState({ addressObj: res }))
      .catch(err => this.setState({ errObj: err }));
  }

  geocodeAddress = () => {
    Geocoder.geocodeAddress(this.state.addressInput)
      .then(res => this.setState({ addressObj: res }))
      .catch(err => this.setState({ errObj: err }));
  }

  runTest = () => {

  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.body}>
              <Button title="Run Test" onPress={this.runTest} />
              <Text>Input Latitude</Text>
              <TextInput
                style={styles.input}
                value={this.state.latInput}
                onChangeText={(input) => this.setState({ latInput: input })}
              />
              <Text>Input Longitude</Text>
              <TextInput
                style={styles.input}
                value={this.state.lngInput}
                onChangeText={(input) => this.setState({ lngInput: input })}
              />
              <Button title="Geocode Position" onPress={this.geocodePosition} />
              <Text>Input Address</Text>
              <TextInput
                style={styles.input}
                value={this.state.addressInput}
                onChangeText={(input) => this.setState({ addressInput: input })}
              />
              <Button title="Geocode Address" onPress={this.geocodeAddress} />
              <Text>Success Output:</Text>
              <Text style={styles.resText}>
                {JSON.stringify(this.state.addressObj, undefined, 2)}
              </Text>
              <Text>Error Output:</Text>
              <Text style={styles.errText}>
                {JSON.stringify(this.state.errObj, undefined, 2)}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  };
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
  },
  body: {
    backgroundColor: '#eee',
    flex: 1,
    padding: 15,
  },
  input: {
    padding: 5,
    marginVertical: 5,
    backgroundColor: '#ccc'
  },
  resText: {
    backgroundColor: '#ccffcc',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  errText: {
    backgroundColor: '#ffcccc',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  }
});

export default App;
