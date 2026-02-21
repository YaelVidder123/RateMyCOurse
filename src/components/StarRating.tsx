import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    rating: number;
    onRate?: (rating: number) => void;
    size?: "sm" | "md" | "lg";
    interactive?: boolean;
}

const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
};

const StarRating = ({ rating, onRate, size = "md", interactive = false }: StarRatingProps) => {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = interactive ? star <= (hovered || rating) : star <= Math.round(rating);
                return (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        className={cn(
                            "transition-all duration-150 disabled:cursor-default",
                            interactive && "cursor-pointer hover:scale-110",
                            filled && interactive && hovered === star && "animate-star-pop"
                        )}
                        onMouseEnter={() => interactive && setHovered(star)}
                        onMouseLeave={() => interactive && setHovered(0)}
                        onClick={() => interactive && onRate?.(star)}
                    >
                        <Star
                            className={cn(
                                sizeMap[size],
                                "transition-colors duration-150",
                                filled
                                    ? "fill-star-filled text-star-filled"
                                    : "fill-transparent text-star-empty"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
