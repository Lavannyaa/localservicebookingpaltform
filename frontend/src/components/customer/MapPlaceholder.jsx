import React from 'react';
import { OpenStreetMapViewer } from '../common/OpenStreetMapViewer';

export const MapPlaceholder = ({
  centerLocation = 'Tirunelveli, Tamil Nadu',
  nearbyCount = 4
}) => {
  return (
    <OpenStreetMapViewer
      centerLocation={centerLocation}
      nearbyCount={nearbyCount}
      initialView="local"
      height="340px"
      showControls={true}
      showShopList={true}
    />
  );
};

export default MapPlaceholder;
