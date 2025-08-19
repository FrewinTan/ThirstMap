import { icons } from "../../../constants";

import ReviewSummary from "../../../components/review/ReviewSummary";
import UserReview from "../../../components/review/UserReview";

const Review = () => {
  return (
    <div>
      <ReviewSummary />

      <div className="flex justify-center">
        <button className="flex flex-row items-center justify-center rounded-[20px] border-1 border-[#CBCBCB] border-solid p-2 m-3 w-[175px]">
          <img src={icons.review} />
          <h1 className="pl-3">Write a review</h1>
        </button>
      </div>

      <hr className="border-[#CBCBCB] h-[2px]"></hr>

      <UserReview />
    </div>
  );
};

export default Review;
