import { useState } from "react";
import { icons } from "../constants";

const StarRating = () => {
  const [hovered, setHovered] = useState<number | null>(0);
  const [selected, setSelected] = useState(0);

  const handleMouseEnter = (index: number) => setHovered(index);
  const handleMouseLeave = () => setHovered(null);
  const handleClick = (index: number) => setSelected(index);

  return (
    <div className="flex flex-row">
      {[1, 2, 3, 4, 5].map((star: number) => (
        <span
          key={star}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(star)}
          className="w-fit h-fit"
       >
        
          <img
            src={(hovered || selected) >= star ? icons.yellowStar : icons.star}
          />
        </span>
      ))}
    </div>
  );
};

export default StarRating;
