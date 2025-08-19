import { VendingDataType } from "../../types/types";
import { icons } from "../constants";

const CustomPin = ({
  vendingData,
  originalIndex,
}: {
  vendingData: VendingDataType[];
  originalIndex: number;
}) => {
  const pinColour = "bg-orange-400";

	const vendingItem = vendingData[originalIndex]
	if(!vendingItem) {
		console.error("No index found")
		return null
	}

  const imageSource =
    vendingItem.type === "Chef In Box" ? icons.chef_hat : "";
  return (
    <div className="relative w-8 h-8">
      <div
        className={`absolute inset-0 ${pinColour} border border-black rounded-full`}
      ></div>

      <div className="absolute left-1/2 bottom-[-8px] w-0 h-0 -translate-x-1/2 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-black"></div>

      <img
        src={imageSource}
        className="absolute inset-0 w-4 h-4 m-auto object-contain"
      />
    </div>
  );
};

export default CustomPin;
