import { Link } from "react-router-dom";
import { BookOpen, Users } from "lucide-react";
import StarRating from "./StarRating";

interface CourseCardProps {
    id: string;
    name: string;
    code: string;
    university: string;
    department: string;
    averageRating: number;
    reviewCount: number;
}

const CourseCard = ({ id, name, code, university, department, averageRating, reviewCount }: CourseCardProps) => {
    return (
        <Link
            to={`/course/${id}`}
            className="block rounded-lg border border-border bg-card p-6 card-hover"
        >
            <div className="mb-3 flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2.5 py-1 font-display text-xs font-semibold text-primary">
                    {code}
                </span>
                <span className="text-xs text-muted-foreground">{department}</span>
            </div>
            <h3 className="mb-1 font-display text-lg font-semibold text-card-foreground leading-snug">
                {name}
            </h3>
            <p className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                {university}
            </p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <StarRating rating={averageRating} size="sm" />
                    <span className="font-display text-sm font-semibold text-card-foreground">
                        {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                    </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
