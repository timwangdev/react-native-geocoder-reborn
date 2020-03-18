import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import Geocoder from '../';

Geocoder.init({
  locale: 'en',
  maxResults: 2,
});

AppRegistry.registerComponent(appName, () => App);
