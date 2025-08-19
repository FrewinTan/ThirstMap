import { icons } from "../../constants";

const ReviewSummary = () => {
  return (
    <div className="pt-5 pl-5 flex flex-row items-center">
      <div className="w-full">
        {[1, 2, 3, 4, 5].map((star: number) => (
          <div className="flex flex-row items-center max-w-[250px]">
            <h4>{star}</h4>
            <div className="h-[8px] bg-[#CBCBCB] w-4/5 rounded-[10px] ml-3">
              <div className="h-[8px] bg-yellow-400 rounded-[10px] w-4/5"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center w-[150px]">
        <h1 className="font-medium font-[Inter] text-[30px]">4.4</h1>
        <div className="flex flex-row justify-center">
          {[1, 2, 3, 4, 5].map((star: number) => (
            <img
              src={4.4 >= star ? icons.yellowStar : icons.star}
              className="w-[12px] h-[12px]"
            />
          ))}
        </div>
        <p className="text-[12px] font-light font-[Inter]">96 Reviews</p>
      </div>
    </div>
  );
};

export default ReviewSummary;
