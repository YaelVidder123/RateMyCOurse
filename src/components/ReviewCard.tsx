import { User } from "lucide-react";
import StarRating from "./StarRating";

interface ReviewCardProps {
    reviewerName: string;
    rating: number;
    comment: string | null;
    createdAt: string;
}

const ReviewCard = ({ reviewerName, rating, comment, createdAt }: ReviewCardProps) => {
    const date = new Date(createdAt);
    const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-display text-sm font-semibold text-card-foreground">
                        {reviewerName}
                    </span>
                </div>
                <span className="text-xs text-muted-foreground">{formatted}</span>
            </div>
            <StarRating rating={rating} size="sm" />
            {comment && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {comment}
                </p>
            )}
        </div>
    );
};

export default ReviewCard;
