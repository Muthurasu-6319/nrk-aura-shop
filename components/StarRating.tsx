
import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  editable = false, 
  onChange, 
  size = 'md',
  showCount = false,
  count = 0
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  const handleClick = (index: number) => {
    if (editable && onChange) {
      onChange(index);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onMouseEnter={() => editable && setHoverRating(index)}
            onMouseLeave={() => editable && setHoverRating(0)}
            disabled={!editable}
            className={`transition-transform ${editable ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
          >
            <svg 
              className={`${sizeClasses[size]} ${
                index <= (hoverRating || rating) 
                  ? 'text-gold-400 fill-current' 
                  : 'text-gray-300 fill-current'
              } transition-colors duration-200`}
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-gray-500 ml-1 font-medium">
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};
