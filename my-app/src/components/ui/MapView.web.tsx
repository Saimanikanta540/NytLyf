import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomMapView(props: any) {
  return (
    <View style={[props.style, styles.placeholder]}>
      <Text style={styles.text}>Map View is not available on Web</Text>
      <Text style={styles.subtext}>Coordinates: {props.initialRegion?.latitude}, {props.initialRegion?.longitude}</Text>
    </View>
  );
}

export const Marker = (props: any) => null;
export const PROVIDER_GOOGLE = 'google';

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#1A1A24',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtext: {
    color: '#6B6B7B',
    fontSize: 12,
    marginTop: 8,
  }
});
