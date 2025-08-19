export declare interface LocationType {
  key: string;
  location: google.maps.LatLngLiteral;
}

export declare interface PositionType {
  lat: number;
  lng: number;
}

export declare interface VendingDataType {
  opening_hour: string;
  payment_type: string;
  type: string;
  name: string;
  location: string;
}

export declare interface MarkersType {
  lat: string;
  lng: string;
}

export declare interface MarkerItem {
  location: google.maps.LatLngLiteral;
  originalIndex: number;
}
