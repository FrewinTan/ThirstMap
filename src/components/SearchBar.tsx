import { useCallback, useState } from "react";
import { icons } from "../constants";
import { useAutoCompleteSuggestion } from "./autocomplete/AutoComplete";
import Control from "./Control";

const SearchBar = ({
  isBouncing,
  routeDestination,
  toggleSideMenu,
  pressed,
  enteredLocation,
  onPlaceSelect,
}: {
  isBouncing: boolean;
  routeDestination: string;
  toggleSideMenu: () => void;
  pressed: () => void;
  enteredLocation: (text: string) => void;
  onPlaceSelect: (place: string) => void;
}) => {
  const bounceStyle = isBouncing
    ? "animate-bounce border-1 border-red-500 border-red-500"
    : "";

  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);

  // Autocomplete suggestion
  const [textEntered, setTextEntered] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debouncedText = setTimeout(() => {
    setDebouncedQuery(textEntered);
  }, 300);

  const suggestion = useAutoCompleteSuggestion({
    input: debouncedQuery,
  });

  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      const place = suggestion.placePrediction?.mainText?.text;

      if (place) {
        setTextEntered(place);
        onPlaceSelect(place);
        setIsSuggestionVisible(false);
      }
    },
    [onPlaceSelect]
  );

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const roundedBorder =
    suggestion.suggestion.length != 0 && isSuggestionVisible
      ? "rounded-t-[10px]"
      : "rounded-[10px]";

  const handleSearchBarBlur = () => {
    setTimeout(() => {
      setIsSuggestionVisible(false);
    }, 200);
  };

  const handleSearchBarFocus = () => {
    setIsSuggestionVisible(true);
  };

  return (
    <>
      {routeDestination ? (
        <div className="w-full h-fit absolute top-0 justify-center p-10 z-10">
          <div className="rounded-[10px] w-full bg-white">
            <div className="flex flex-row items-center p-3">
              <img
                src={icons.circle}
                className="w-[16px] h-[16px] fill-black"
              />
              <h1 className="font-normal text-[16px] pl-3">
                {capitalizeFirstLetter(textEntered)}
              </h1>
            </div>

            <hr className="w-11/12 mx-auto"></hr>

            <div className="flex flex-row items-center p-3">
              <img
                src={icons.location}
                className="w-[16px] h-[16px] fill-black"
              />
              <h1 className="font-normal text-[16px] pl-3">
                {routeDestination}
              </h1>
            </div>
          </div>

          <div className="justify-end flex">
            <Control />
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-0 justify-center w-full h-fit p-10 z-10">
            <div
              className={`${bounceStyle} ${roundedBorder} bg-white w-full h-fit flex flex-row p-2 items-center`}
            >
              <button
                id="side_menu"
                className="h-[20px] w-[20px] mr-2"
                onClick={toggleSideMenu}
              >
                <img src={icons.menu} />
              </button>

              <input
                id="text_input"
                type="text"
                onChange={(text) => {
                  setTextEntered(text.target.value);
                  enteredLocation(text.target.value);
                }}
                placeholder="Enter your location"
                value={textEntered}
                className="w-full focus:border-0 pl-1"
                size={20}
                onFocusCapture={handleSearchBarFocus}
                onBlur={handleSearchBarBlur}
              ></input>

              <button id="direction_icon" className="pl-1" onClick={pressed}>
                <img src={icons.search} />
              </button>
            </div>

            {isSuggestionVisible && !isBouncing && (
              <div className="bg-white rounded-b-[10px]">
                <ul>
                  {suggestion.suggestion.length > 0 &&
                    suggestion.suggestion.map((item, index) => {
                      return (
                        <li
                          className="flex flex-row space-x-2 p-2 items-center"
                          key={index}
                          onClick={() => handleSuggestionClick(item)}
                        >
                          <img
                            src={icons.location}
                            className="w-[16px] h-[16px]"
                          />
                          <p className="text-[12px]">
                            {item.placePrediction?.mainText?.text}
                          </p>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}

            <div className="justify-end flex">
              <Control />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchBar;
