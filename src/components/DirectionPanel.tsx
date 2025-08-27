import React, { useState, useEffect, useRef } from "react";
import { icons } from "../constants";

const DirectionPanel = ({
  route,
  clearEverything,
}: {
  route: google.maps.DirectionsRoute[];
  clearEverything: (clear: boolean) => void;
}) => {
  const peekHeight = 100;
  const modalCollapsed = window.innerHeight - peekHeight;
  const modalExpanded: number = 30;

  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(modalCollapsed);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const yRef = useRef(modalCollapsed);
  const startPos = useRef(modalCollapsed);
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
        e.preventDefault();
      }
    };
    window.addEventListener("touchmove", preventTouch, { passive: false });
    return () => window.removeEventListener("touchmove", preventTouch);
  }, [dragging]);

  return (
    <>
      <div className="fixed inset-0 z-20 bg-white/0" />

      <div
        className={`fixed inset-0 rounded-t-[20px] bg-white z-30 
				${
          dragging
            ? "none"
            : "will-change-transform transition-transform duration-200 ease-out"
        } 
				${position == modalExpanded ? "overflow-y-auto" : ""}`}
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
          <img src={icons.direction_walk} className="w-[48px] h-[48px]" />
          <div>
            <h1 className="text-[24px]">{route[0].legs[0].duration?.text}</h1>
            <h1 className="font-light">{route[0].legs[0].distance?.text}</h1>
          </div>
          <div className="ml-auto bg-gray-200 rounded-full w-[24px] h-[24px] mr-3 flex justify-center items-center">
            <button
              onClick={() => clearEverything(true)}
              className="w-[16px] h-[16px]"
            >
              <img src={icons.close} />
            </button>
          </div>
        </div>

        <h1 className="pl-3">Steps</h1>

        <ul>
          {route[0].legs[0].steps.map((step, index) => (
            <li className="items-center flex p-3 gap-3" key={index}>
              {step.maneuver == "turn-right" ? (
                <img src={icons.turn_right} className="w-[24px] h-[24px]" />
              ) : step.maneuver == "turn-left" ? (
                <img src={icons.turn_left} />
              ) : (
                <img src={icons.straight} />
              )}
              <div className="flex flex-col w-full">
                <span>{step.instructions.replace(/<[^>]+>/g, "")}</span>
                <div className="flex flex-row items-center gap-2 text-sm text-gray-600 mt-3 w-full">
                  <span>{step.distance?.text}</span>
                  <span>•</span>
                  <span>{step.duration?.text}</span>
                  <div className="flex-grow h-px bg-gray-300 ml-2" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DirectionPanel;
