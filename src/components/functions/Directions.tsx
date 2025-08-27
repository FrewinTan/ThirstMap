import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import DirectionPanel from "../DirectionPanel";

export default function Directions({
  origin,
  destination,
  routeDestination,
  clearEverything,
}: {
  origin: string | google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  routeDestination: (route: string) => void;
  clearEverything: (clear: boolean) => void;
}) {
  const map = useMap();

  const directionsService = new google.maps.DirectionsService();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [route, setRoute] = useState<google.maps.DirectionsRoute[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!map) return;

    const renderer = new google.maps.DirectionsRenderer({
      map,
      polylineOptions: {
        strokeColor: "#a8b6ff",
        strokeOpacity: 75,
        strokeWeight: 4,
      },
      markerOptions: { visible: false },
    });
    setDirectionsRenderer(renderer);

    return () => {
      renderer.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (!directionsRenderer || !map || !destination) return;
    setLoading(true);

    const fetchDirection = async () => {
      await directionsService
        .route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.WALKING,
          provideRouteAlternatives: false,
          region: "SG",
        })
        .then((response) => {
          directionsRenderer.setDirections(response);
          setRoute(response.routes);
        })
        .catch((error) => {
          console.error("Direction Rendering Error", error);
        })
        .finally(() => setLoading(false));
    };
    fetchDirection();
  }, [directionsRenderer, destination]);

  useEffect(() => {
    if (route && loading == false) {
      routeDestination(route[0].legs[0].end_address);
    }
  }, [route, loading]);

  if (!route || loading) return null;
  return (
    <>
      <div className="fixed inset-0 z-10 bg-white/0" />
      <DirectionPanel route={route} clearEverything={clearEverything} />
    </>
  );
}
