import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function CustomMapView(props: any) {
  return (
    <MapView {...props}>
      {props.children}
    </MapView>
  );
}

export { Marker, PROVIDER_GOOGLE };
