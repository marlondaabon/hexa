import React from 'react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

MIcon.loadFont();

export const IconSizes = {
  small: 13,
  medium: 18,
  large: 25,
  extraLarge: 27,
  hexa: 50,
};

const MaterialIcon = ({size, name, color}) => (
  <MIcon 
    name={name} 
    size={IconSizes[size]} 
    color={color} 
  />
);

export default MaterialIcon;