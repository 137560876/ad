/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Route from './Route';
import {name as appName} from './app.json';
import './utils/storage';

AppRegistry.registerComponent(appName, () => Route);
