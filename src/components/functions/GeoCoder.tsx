import { useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";

export default function GeoCoder({
  enteredLocation,
  searchBarPressed,
}: {
  enteredLocation: string | google.maps.LatLngLiteral;
  searchBarPressed: number;
}) {
  const map = useMap();
  const [markerPos, setMarkerPos] = useState<google.maps.LatLng | null>();

  useEffect(() => {
    if (!enteredLocation || typeof enteredLocation != "string" || !map) return;

    const geoCoder = new google.maps.Geocoder();

    geoCoder.geocode({ address: enteredLocation }, function (results, status) {
      if (status === "OK" && results != null && results.length > 0) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.panTo(location);
        map.setZoom(16);
        setMarkerPos(location);
      } else {
        console.log("Geocoding failed:", status);
        alert("Please input an appropriate location");
      }
    });
  }, [searchBarPressed]);
  return <AdvancedMarker position={markerPos}></AdvancedMarker>;
}
