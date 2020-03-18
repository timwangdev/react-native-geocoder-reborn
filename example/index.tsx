import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { geocoder as conf } from './env.json';
import Geocoder from '../';

Geocoder.init(conf);

AppRegistry.registerComponent(appName, () => App);
