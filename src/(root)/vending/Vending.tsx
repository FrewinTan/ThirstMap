import { useEffect, useRef, useState } from "react";
import { icons, images } from "../../constants";

import Overview from "./(tabs)/Overview";

import { useFileImage } from "../../lib/appwrite";
import { VendingDataType } from "../../../types/types";
import EditForm from "./(tabs)/forms/EditForm";
import AddImages from "./(tabs)/forms/AddImages";

const Vending = ({
  onClose,
  vendingData,
  vendingLocation,
  locationToBeUsed,
  goButtonPressed,
}: {
  onClose: () => void;

  vendingData: VendingDataType;
  vendingLocation: google.maps.LatLngLiteral;
  locationToBeUsed: google.maps.LatLngLiteral | string;
  goButtonPressed: (location: google.maps.LatLngLiteral) => void;
}) => {
  const [activeTabs, setActiveTabs] = useState<1 | 2 | 3 | 4>(1);

  const peekHeight = 200;
  const modalCollapsed = window.innerHeight - peekHeight;
  const modalExpanded: number = 30;

  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(modalCollapsed);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const yRef = useRef(modalCollapsed); //Tracks position of modal
  const startPos = useRef(modalCollapsed); //Tracks initial position of modal
  const dragStartY = useRef(0);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    startPos.current = yRef.current;
  };

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (dragging && modalRef.current) {
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const delta = clientY - dragStartY.current;
      const newPos = startPos.current + delta;

      const constrainedPosition = Math.min(
        Math.max(newPos, modalExpanded),
        modalCollapsed
      );
      setPosition(constrainedPosition);
      yRef.current = constrainedPosition;
    }
  };

  const stopDrag = () => {
    setDragging(false);
    const snapTo =
      yRef.current < (modalCollapsed + modalExpanded) / 2
        ? modalExpanded
        : modalCollapsed;

    setPosition(snapTo);
    yRef.current = snapTo;
  };

  useEffect(() => {
    if (dragging) {
      const mouseMove = (e: MouseEvent | TouchEvent) => handleDrag(e);
      const mouseUp = () => stopDrag();

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
      document.addEventListener("touchmove", mouseMove);
      document.addEventListener("touchend", mouseUp);

      return () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
        document.removeEventListener("touchmove", mouseMove);
        document.removeEventListener("touchend", mouseUp);
      };
    }
  }, [dragging]);

  useEffect(() => {
    if (dragging) {
      document.body.style.overflow = "hidden";
      modalRef.current?.classList.add("modal-dragging");
    } else {
      document.body.style.overflow = "";
      modalRef.current?.classList.remove("modal-dragging");
    }
  }, [dragging]);

  useEffect(() => {
    const preventTouch = (e: TouchEvent) => {
      if (dragging) {
        e.stopPropagation();
        e.preventDefault();
      }
    };
    window.addEventListener("touchmove", preventTouch, { passive: false });
    return () => window.removeEventListener("touchmove", preventTouch);
  }, [dragging]);

  // Get images
  const result = useFileImage(vendingData.location);
  const resultData = result.data != undefined ? result.data : [];
  const firstImage = resultData[0];

  const header =
    activeTabs == 1 ? "Overview" : activeTabs == 3 ? "Edit" : "Image";

  return (
    <div
      className={`fixed inset-0  rounded-t-[20px] bg-white z-30 
					${
            dragging
              ? "none"
              : "will-change-transform transition-transform duration-200 ease-out"
          } 
					${position == modalExpanded ? "overflow-y-auto no-scrollbar" : ""}`}
      style={{
        transform: `translateY(${position}px)`,
      }}
      ref={modalRef}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2 cursor-grab"></div>

      <div className="flex flex-row items-center p-3">
        <div>
          <h1 className="font-[Inter] font-semibold pl-5">
            {vendingData.name}
          </h1>
          {/** <h2 className="font-[Inter] font-semibold ml-5">4.0 ☆☆☆☆☆ (10)</h2> */}
        </div>

        <div className="ml-auto bg-gray-200 rounded-full w-[24px] h-[24px] mr-3 flex justify-center items-center">
          <button onClick={onClose} className="w-[16px] h-[16px] ">
            <img src={icons.close} />
          </button>
        </div>
      </div>

      <div className="justify-center flex">
        {Array.isArray(resultData) ? (
          <img src={firstImage} className="w-[180px] object-cover" />
        ) : (
          <img
            src={images.not_available}
            className="w-[180px] object-cover rounded-[20px]"
          ></img>
        )}
      </div>

      <div className="justify-evenly flex pt-3">
        <button
          className={activeTabs !== 2 ? "border-b-2 border-[#A8C4FF]" : ""}
          onClick={() => setActiveTabs(1)}
          disabled={activeTabs == 3 ? true : false}
        >
          <p
            className={`${
              activeTabs !== 2 ? "text-[#A8C4FF]" : ""
            } font-[Inter]`}
          >
            {header}
          </p>
        </button>
        {/*+ <button
	            className={activeTabs == 2 ? "border-b-2 border-[#A8C4FF]" : ""}
	            onClick={() => setActiveTabs(2)}
	          >
	            <p
	              className={`${
	                activeTabs == 2 ? "text-[#A8C4FF]" : ""
	              } font-[Inter]`}
	            >
	              Review
	            </p>
	          </button> */}
      </div>

      <hr className="border-[#CBCBCB] h-[2px]"></hr>

      <div>
        {activeTabs == 1 && (
          <Overview
            type={vendingData.type}
            location={vendingData.location}
            opening_hour={vendingData.opening_hour}
            payment_type={vendingData.payment_type}
            editFormPressed={(item) => item && setActiveTabs(3)}
            imageFormPressed={(item) => item && setActiveTabs(4)}
            images={resultData}
          />
        )}
        {/** activeTabs == 2 && <Review /> */}
        {activeTabs == 3 && (
          <EditForm backButtonPressed={(item) => item && setActiveTabs(1)} />
        )}
        {activeTabs == 4 && (
          <AddImages
            backButtonPressed={(item) => item && setActiveTabs(1)}
            name={vendingData.location}
          />
        )}
      </div>

      {activeTabs !== 3 && activeTabs !== 4 ? (
        <button
          className="bg-[#A8C4FF] rounded-[20px] w-3/5 h-[48px] flex flex-row justify-center items-center mx-auto mt-5"
          onClick={() => {
            if (!locationToBeUsed) {
              alert("Please enter your location");
            } else {
              goButtonPressed(vendingLocation);
            }
          }}
        >
          <img src={icons.location} className="w-[20px] h-[20px]" />
          <h2>Go</h2>
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Vending;
