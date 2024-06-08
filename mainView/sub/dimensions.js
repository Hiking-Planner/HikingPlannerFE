import { Dimensions } from 'react-native';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');

export const WINDOW_WIDTH = window.width;
export const WINDOW_HEIGHT = window.height;
export const SCREEN_WIDTH = screen.width;
export const SCREEN_HEIGHT = screen.height;
