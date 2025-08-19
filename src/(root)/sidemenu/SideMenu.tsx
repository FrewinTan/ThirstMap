import { Link } from "react-router-dom";
import { icons } from "../../constants";

const SideMenu = ({
  onOpen,
  onClose,
}: {
  onOpen: boolean;
  onClose: () => void;
}) => {
  if (!onOpen) return null;

  return (
    <div className="bg-[#A8C4FF] h-dvh sm:w-2/10 w-3/10 rounded-r-[10px] absolute top-0 left-0 z-99">
      <div className="flex flex-row items-center justify-center mt-5 space-x-2">
        <button onClick={onClose}>
          <img
            src={icons.menu}
            className="sm:w-[20px] sm:h-[20px] w-[16px] h-[16px]"
          />
        </button>
        <h1 className="font-[Inter] font-medium sm:text-[20px] text-[16px]">
          ThirstMap
        </h1>
      </div>

      <div className="flex justify-center">
        {/** <Link to="/Guide">
            <div className="">
              <button className="flex flex-row items-center">
                <img src={icons.about} className="w-[24px] h-[24px]" />
                <h1 className="text-[18px] font-[Inter]">Guide</h1>
              </button>
              <hr className="w-4/5"></hr>
            </div>
          </Link> */}

        <Link to="/CrowdSource">
          <div className="mt-3 transition-all duration-150">
            <button className="flex flex-row items-center">
              <img src={icons.pencil} className="w-[20px] h-[20px]" />
              <h1 className="text-[16px] font-[Inter]">Crowdsource</h1>
            </button>
            <hr className="w-9/10 mx-auto"></hr>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideMenu;
