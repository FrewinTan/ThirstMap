import { icons } from "../constants";

const Nearest = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="bg-[#A8C4FF] z-10 rounded-[20px] absolute bottom-5 left-3 w-[48px] h-[48px] items-center justify-center flex flex-col"
      onClick={onClick}
    >
      <img src={icons.vending_machine} className="w-[24px] h-[24px]"/>
      <h1 className="font-[Inter] text-[10px]">Find</h1>
    </button>
  );
};

export default Nearest;
