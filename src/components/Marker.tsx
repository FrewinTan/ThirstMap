import { AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MarkerItem, VendingDataType } from "../../types/types";
import CustomPin from "./CustomPin";

const Marker = ({
  onClick,
  vendingLocation,
  vendingData,
}: {
  onClick: (index: number) => void;
  vendingLocation: google.maps.LatLngLiteral[];
  vendingData: VendingDataType[];
}) => {
  const map = useMap();

  const [filteredMarkers, setFilteredMarkers] = useState<MarkerItem[]>([]);

  const allMarkers = useMemo<MarkerItem[]>(
    () =>
      vendingLocation.map((location, originalIndex) => ({
        location,
        originalIndex,
      })),
    [vendingLocation]
  );

  const computeVisible = useCallback(() => {
    const zoom = map?.getZoom();
    const bounds = map?.getBounds();
    if (zoom == null || !bounds) return;

    if (zoom >= 15) {
      setFilteredMarkers(
        allMarkers.filter(({ location }) => {
          return bounds.contains(new google.maps.LatLng(location));
        })
      );
    } else {
      setFilteredMarkers([]);
    }
  }, [map, allMarkers]);

  useEffect(() => {
    if (!map) return;
    computeVisible();
    const idleListener = map.addListener("idle", computeVisible);

    return () => {
      idleListener.remove();
    };
  }, [map, computeVisible]);

  return (
    <>
      {filteredMarkers?.map(({ location, originalIndex }, index) => {
        return (
          <AdvancedMarker
            key={index}
            position={{
              lat: location.lat,
              lng: location.lng,
            }}
            onClick={() => {
              onClick(originalIndex);
            }}
          >
            <CustomPin
              vendingData={vendingData}
              originalIndex={originalIndex}
            />
          </AdvancedMarker>
        );
      })}
    </>
  );
};

export default Marker;
