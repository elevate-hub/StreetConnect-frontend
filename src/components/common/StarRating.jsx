import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, size = 20, interactive = false, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const getEmoji = (rating) => {
    if (rating <= 2) return '😡';
    if (rating === 3) return '🙂';
    return '😍';
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {stars.map(s => (
        <button
          key={s}
          type="button"
          disabled={!interactive}
          onClick={() => handleClick(s)}
          onMouseEnter={() => handleMouseEnter(s)}
          onMouseLeave={handleMouseLeave}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star
            size={size}
            className={`${
              s <= displayRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-lg">
          {getEmoji(rating)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
