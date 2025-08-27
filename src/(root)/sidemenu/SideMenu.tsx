import { icons } from "../../constants";

const SideMenu = ({
  onOpen,
  onClose,
  crowdSource,
}: {
  onOpen: boolean;
  onClose: () => void;
  crowdSource: (item: boolean) => void;
}) => {
  if (!onOpen) return null;

  return (
    <div className="inset-0 absolute bg-black/50 z-99">
    	<div className="h-screen sm:w-2/10 w-5/10 rounded-r-[10px] absolute top-0 left-0 z-10">
	      <div className="flex flex-row items-center justify-between p-3 bg-[#A8C4FF] h-1/15">
	        <h1 className="font-[Inter] font-medium text-[16px] text-white">
	          ThirstMap
	        </h1>
	        <button onClick={onClose}>
	          <img
	            src={icons.close_white}
	            className="sm:w-[24px] sm:h-[24px] w-[20px] h-[20px]"
	          />
	        </button>
	      </div>
	
	      <div className="bg-white h-14/15">
	        {/** <Link to="/Guide">
	            <div className="">
	              <button className="flex flex-row items-center">
	                <img src={icons.about} className="w-[24px] h-[24px]" />
	                <h1 className="text-[18px] font-[Inter]">Guide</h1>
	              </button>
	              <hr className="w-4/5"></hr>
	            </div>
	          </Link> */}
	
	        <div className="flex justify-center pt-3">
	          <button
	            className="flex flex-row items-center space-x-2"
	            onClick={() => {
	              crowdSource(true);
	              onClose();
	            }}
	          >
	            <img src={icons.pencil} className="w-[20px] h-[20px] " />
	            <h1 className="sm:text-[16px] text-[14px] font-[Inter]">
	              Crowdsource
	            </h1>
	          </button>
	        </div>
	      </div>
	    </div>
    </div>
  );
};

export default SideMenu;
