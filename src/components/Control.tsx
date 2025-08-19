import { useMap } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { icons, images } from "../constants";

const Control = () => {
  const map = useMap();
  const [isDefault, setIsDefault] = useState(true);
  const [isSatellite, setIsSatellite] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const toggleDefaultType = () => {
    if (map) {
      if (isSatellite) {
        map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
      }
      setIsDefault(true);
      setIsSatellite(false);
    }
  };

  const toggleSatelliteType = () => {
    if (map) {
      if (isDefault) {
        map.setMapTypeId(google.maps.MapTypeId.HYBRID);
      }
      setIsDefault(false);
      setIsSatellite(true);
    }
  };

  /** const toggleStreetView = () => {
    if (map) {
      if (isDefault || isSatellite) {
        const converageLayer = new google.maps.StreetViewCoverageLayer();
        converageLayer.setMap(map);
      }
      setIsDefault(false);
      setIsSatellite(false);
    }
  }; */

  return (
    <>
      {isPressed ? (
        <div className="bg-white rounded-[10px] mt-2">
          <div className="flex justify-between p-2 ">
            <h1 className="font-[Inter] text-[12px]">Map Type</h1>
            <button onClick={() => setIsPressed(false)}>
              <img src={icons.close} className="h-[16px] w-[16px]" />
            </button>
          </div>

          <div className="flex flex-row justify-around px-2 space-x-2">
            <div className="flex flex-col items-center">
              <button onClick={toggleDefaultType}>
                <img
                  src={images.default_maptype}
                  className="w-[24px] h-[24px]"
                />
              </button>
              <h1 className="font-[Inter] text-[12px]">Default</h1>
            </div>

            <div className="flex flex-col items-center">
              <button onClick={toggleSatelliteType}>
                <img src={images.satellite} className="w-[24px] h-[24px]" />
              </button>
              <h1 className="font-[Inter] text-[12px]">Satellite</h1>
            </div>

            {/** <div className="flex flex-col items-center">
              <button onClick={toggleStreetView}>
                <img
                  src={images.street_view}
                  className="w-[24px] h-[24px]"
                />
              </button>
              <h1 className="font-[Inter] text-[12px]">Default</h1>
            </div> */}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsPressed(true)}
          className="bg-white rounded-full mt-2"
        >
          <img src={icons.stack} className="h-[16px] w-[16  px] m-2" />
        </button>
      )}
    </>
  );
};

export default Control;
