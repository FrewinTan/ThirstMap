import { images } from "../../constants";
import { icons } from "../../constants";

const UserReview = () => {
  return (
    <div >
      <div className="flex flex-row items-center pl-5 pt-5">
        <img src={images.test} className="rounded-full w-[36px] h-[36px]" />
        <h1 className="pl-2">Eric</h1>
      </div>

      <div className="flex flex-row pl-5 pt-3 items-center">
        {[1, 2, 3, 4, 5].map((star: number) => (
          <img
            src={4.4 >= star ? icons.yellowStar : icons.star}
            className="w-[12px] h-[12px]"
          />
        ))}
        <h5 className="pl-3 text-[12px]">2 Months Ago</h5>
      </div>

      <p className="pl-5 pt-3 text-[12px]">Awesome vending machine!!!</p>
      <img src={images.test} className="pt-3" />

      <div className="flex flex-row p-5 justify-center">
        <button className="flex flex-row items-center">
          <img src={icons.like} className="w-[16px] h-[16px]" />
          <h3 className="pl-2 text-[16px]">Like</h3>
        </button>

        <button className="flex flex-row items-center pl-3">
          <img src={icons.share} className="w-[16px] h-[16px]" />
          <h3 className="pl-2 text-[16px]">Share</h3>
        </button>
      </div>
    </div>
  );
};

export default UserReview;
