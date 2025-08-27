import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

import Marker from "../components/Marker";
import SearchBar from "../components/SearchBar";
import Vending from "./vending/Vending";
import Nearest from "../components/Nearest";
import GeoCoder from "../components/functions/GeoCoder";
import DistanceMatrix from "../components/functions/DistanceMatrix";
import { useVendingInfo, useVendingLocation } from "../lib/get";
import { VendingDataType } from "../../types/types";
import SideMenu from "./sidemenu/SideMenu";
import Directions from "../components/functions/Directions";
import CrowdSource from "./sidemenu/CrowdSource";

const MapPage = () => {
  // .env keys
  const google_api = import.meta.env.VITE_google_api;
  const map_id = import.meta.env.VITE_map_id;
  if (!google_api || !map_id) throw new Error("Google maps key Error");

  // Get user permission
  const [locationError, setLocationError] = useState<number | null>(null);

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          setLocationError(1); // previously denied
        } else if (result.state === "granted") {
          setLocationError(0);
        } else {
          setLocationError(null); // prompt will show
        }
      });
    }
  }, []);
  // Get user location through GPS
  const [userLocation, setUserLocation] = useState<
    google.maps.LatLngLiteral | string
  >("");

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          setLocationError(0);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError(1);
          } else {
            setLocationError(2);
          }
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by your browser");
    }
  };

  const [nearestButtonPressed, setNearestButtonPressed] = useState(false);
  const [toggleVendingPage, setToggleVendingPage] = useState(false);
  const [toggleSideMenu, setToggleSideMenu] = useState(false);
  const [searchBarPressed, setSearchBarPressed] = useState<number>(0);
  const [routeDestination, setRouteDestination] = useState<string>("");
  const [clearEverything, setClearEverything] = useState(false);
  const [toggleCrowdSource, setToggleCrowdSource] = useState(false);

  // useState for Origin and Destination for Directions
  const [destination, setDestination] =
    useState<google.maps.LatLngLiteral | null>();

  // Bounce Animation
  const [isBouncing, setIsBouncing] = useState(false);
  const bounce = () => {
    if (userLocation) return;
    if (locationError === 1) {
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 3500);
    }
  };

  // useState for Marker
  const [markerIndex, setMarkerIndex] = useState<number>(0);

  // Get Vending Data from neondb
  const [vendingData, setVendingData] = useState<VendingDataType[]>([]);

  const { data: vendingInfo } = useVendingInfo();
  useEffect(() => {
    if (vendingInfo) {
      setVendingData(vendingInfo);
    }
  }, [vendingInfo]);

  // Get vending location from neondb
  const [vendingLocation, setVendingLocation] = useState<
    google.maps.LatLngLiteral[]
  >([]);

  const { data: vendingLocation1 } = useVendingLocation();

  useEffect(() => {
    if (vendingLocation1) {
      setVendingLocation(vendingLocation1);
    }
  }, [vendingLocation1]);

  // Go button presssed
  const goButtonPressed = (location: google.maps.LatLngLiteral) => {
    setDestination(location);
    setToggleVendingPage(false);
  };

  useEffect(() => {
    setDestination(null);
    setRouteDestination("");
    setClearEverything(false);
  }, [clearEverything]);

  return (
    <>
      <APIProvider apiKey={google_api}>
        <Map
          className="w-dvw h-dvh z-0"
          defaultZoom={15}
          defaultCenter={{ lat: 1.3599389, lng: 103.8372196 }}
          fullscreenControl={false}
          mapId={map_id}
          mapTypeControl={false}
          streetViewControl={false}
          disableDefaultUI={true}
          scrollwheel={true}
        >
          <Marker
            onClick={(index) => {
              setMarkerIndex(index);
              setToggleVendingPage(!toggleVendingPage);
            }}
            vendingLocation={vendingLocation}
            vendingData={vendingData}
          />
          {toggleVendingPage && (
            <Vending
              onClose={() => setToggleVendingPage(!toggleVendingPage)}
              vendingData={vendingData[markerIndex]}
              vendingLocation={vendingLocation[markerIndex]}
              locationToBeUsed={userLocation}
              goButtonPressed={goButtonPressed}
            />
          )}
          <SideMenu
            onOpen={toggleSideMenu}
            onClose={() => setToggleSideMenu(!toggleSideMenu)}
            crowdSource={setToggleCrowdSource}
          />
          {toggleCrowdSource && (
            <CrowdSource crowdSource={setToggleCrowdSource} />
          )}
          <GeoCoder
            enteredLocation={userLocation}
            searchBarPressed={searchBarPressed}
          />
          <DistanceMatrix
            origin={[userLocation]}
            destination={vendingLocation}
            nearestButtonPressed={nearestButtonPressed}
            passMinimumDestination={setDestination}
          />
          {destination && clearEverything != true && (
            <Directions
              origin={userLocation}
              destination={destination}
              routeDestination={(route) => setRouteDestination(route)}
              clearEverything={setClearEverything}
            />
          )}
        </Map>
        <div className="flex justify-end">
          <SearchBar
            isBouncing={isBouncing}
            routeDestination={routeDestination}
            toggleSideMenu={() => setToggleSideMenu(!toggleSideMenu)}
            pressed={() => {
              setSearchBarPressed(searchBarPressed + 1);
              bounce();
            }}
            enteredLocation={setUserLocation}
            onPlaceSelect={setUserLocation}
          />
        </div>

        <Nearest
          onClick={() => {
            getUserLocation();
            setNearestButtonPressed(!nearestButtonPressed);
            bounce();
          }}
        />
      </APIProvider>
    </>
  );
};

export default MapPage;
