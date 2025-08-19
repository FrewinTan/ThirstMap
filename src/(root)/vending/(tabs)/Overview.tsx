import { icons } from "../../../constants";

const Overview = ({
  type,
  location,
  opening_hour,
  payment_type,
  images,
  editFormPressed,
  imageFormPressed,
}: {
  type: string;
  location: string;
  opening_hour: string;
  payment_type: string;
  images: string[];
  editFormPressed: (item: boolean) => void;
  imageFormPressed: (item: boolean) => void;
}) => {
  return (
    <div>
      <div className="flex flex-col space-y-5 mt-5 ml-5">
        <div className="flex items-center ">
          <img src={icons.vending_machine} className="w-[20px] h-[20px]" />
          <p className="font-[Inter] font-normal ml-3">{type}</p>
        </div>

        <div className="flex items-center">
          <img src={icons.location} className="w-[20px] h-[20px]" />
          <p className="font-[Inter] font-normal ml-3">{location}</p>
        </div>

        <div className="flex items-center">
          <img src={icons.clock} className="w-[20px] h-[20px]" />
          <p className="font-[Inter] font-normal ml-3">{opening_hour}</p>
        </div>

        <div className="flex items-center">
          <img src={icons.credit_card} className="w-[20px] h-[20px]" />
          <p className="font-[Inter] font-normal ml-3">{payment_type}</p>
        </div>

        <button
          className="rounded-[20px] bg-[#A8C4FF]/50 w-fit h-fit flex flex-row justify-center mx-auto"
          onClick={() => editFormPressed(true)}
        >
          <img src={icons.pencil} className="m-2 ml-2 w-[20px] h-[20px]" />
          <h2 className="m-2 mr-2">Suggests an edit</h2>
        </button>
      </div>

      <hr className="border-[#CBCBCB] h-[2px] mt-5"></hr>

      <div>
        <h1 className="m-5 font-[Inter] font-semibold">Photos and Videos</h1>
        {Array.isArray(images) && (
          <div className="flex flex-row w-full px-5 pb-5 space-x-3">
            {images.map((url, index) => (
              <img
                src={url}
                key={index}
                className="w-2/5 h-2/5 rounded-[10px]"
              ></img>
            ))}
          </div>
        )}
      </div>
      <button
        className="rounded-[20px] bg-[#A8C4FF]/50 w-fit h-fit flex flex-row justify-center mx-auto"
        onClick={() => imageFormPressed(true)}
      >
        <img src={icons.add} className="m-2 ml-2 w-[20px] h-[20px]" />
        <h2 className="m-2 mr-2">Add photos</h2>
      </button>

      <hr className="border-[#CBCBCB] h-[2px] mt-5"></hr>
    </div>
  );
};

export default Overview;
