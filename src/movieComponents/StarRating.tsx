import { CSSProperties, useState } from 'react';

//Moved outside of component since this object does not need to be re-rendered
//If StarRating rerenders, the function needs to be called again
const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
};

const starContainerStyle: CSSProperties = {
    display: 'flex',
};

//Types
interface StarRatingProps {
    maxRating?: number;
    color?: string;
    size?: number;
    className?: string;
    messages?: string[];
    defaultRating?: number;
    onSetRating?: (n: number) => void;
}

interface StarProps {
    full: boolean;
    color: string;
    size: number;
    onRate: () => void;
    onHoverIn: () => void;
    onHoverOut: () => void;
}

export default function StarRating({
    maxRating = 5,
    color = '#fcc419',
    size = 48,
    className = '',
    messages = [],
    defaultRating = 0,
    onSetRating,
}: StarRatingProps) {
    const [rating, setRating] = useState(defaultRating);
    const [tempRating, setTempRating] = useState(0);

    function handleRating(rate: number) {
        setRating(rate);
        onSetRating?.(rate);
    }

    function handleHoverIn(rate: number) {
        setTempRating(rate);
    }

    function handleHoverOut() {
        setTempRating(0);
    }

    const textStyle: CSSProperties = {
        lineHeight: '1',
        margin: '0',
        color,
        fontSize: `${size / 1.5}px`,
    };

    return (
        <div style={containerStyle} className={className}>
            <div style={starContainerStyle}>
                {Array.from({ length: maxRating }, (_, num) => {
                    return (
                        <Star
                            key={num}
                            full={
                                tempRating
                                    ? num + 1 <= tempRating
                                    : num + 1 <= rating
                            }
                            color={color}
                            size={size}
                            onRate={() => handleRating(num + 1)}
                            onHoverIn={() => handleHoverIn(num + 1)}
                            onHoverOut={() => handleHoverOut()}
                        />
                    );
                })}
            </div>

            <p style={textStyle}>
                {messages.length === maxRating
                    ? messages[tempRating ? tempRating - 1 : rating - 1]
                    : tempRating || rating || ''}
            </p>
            <div></div>
        </div>
    );
}

function Star({ full, color, size, onRate, onHoverIn, onHoverOut }: StarProps) {
    const starStyle: CSSProperties = {
        width: `${size}px`,
        height: `${size}px`,
        display: 'block',
        cursor: 'pointer',
    };

    return (
        <span
            role="button"
            style={starStyle}
            onClick={onRate}
            onMouseEnter={onHoverIn}
            onMouseLeave={onHoverOut}
        >
            {full ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={color}
                    stroke={color}
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={color}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="{2}"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            )}
        </span>
    );
}