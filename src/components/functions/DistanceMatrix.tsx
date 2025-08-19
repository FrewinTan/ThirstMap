import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

export default function DistanceMatrix({
  origin,
  destination,
  nearestButtonPressed,
  passMinimumDestination,
}: {
  origin: (google.maps.LatLngLiteral | string)[];
  destination: google.maps.LatLngLiteral[];
  nearestButtonPressed: boolean;
  passMinimumDestination: (text: google.maps.LatLngLiteral) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const distanceMatrix = new google.maps.DistanceMatrixService();

    // Split array into length of 25
    const chunkArray = () => {
      const result: google.maps.LatLngLiteral[][] = [];
      for (let i = 0; i < destination.length; i += 25) {
        result.push(destination.slice(i, i + 25));
      }
      return result;
    };
    // Initialise chunkArray
    const destinationChuck = chunkArray();

    // Function to location of least distance
    async function getLeastDistance() {
      let allResponses = [];
      for (let i = 0; i < destinationChuck.length; i++) {
        const response = await distanceMatrix.getDistanceMatrix({
          origins: origin,
          destinations: destinationChuck[i],
          travelMode: google.maps.TravelMode.WALKING,
        });
        allResponses.push(response);
      }

      // variables
      let minDuration = Infinity;
      let minDestination: google.maps.LatLngLiteral | null = null;

      for (let j = 0; j < destinationChuck.length; j++) {
        const elements = allResponses[j].rows[0].elements;
        for (
          let elementsLength = 0;
          elementsLength < elements.length;
          elementsLength++
        ) {
          const element = elements[elementsLength];
          if (element && element.duration?.value && element.duration?.value < minDuration) {
            minDuration = element.duration.value;
            minDestination = destinationChuck[j][elementsLength];
          } else {
            continue;
          }
        }
      }

      if (minDestination) {
        map?.setCenter(minDestination);
        map?.setZoom(15)
        passMinimumDestination(minDestination);
      }

    }
    getLeastDistance();
  }, [nearestButtonPressed]);
  return null;
}
