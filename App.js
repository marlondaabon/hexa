import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import HomeStack from './src/components/home/HomeStack';

export default function App() {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}

