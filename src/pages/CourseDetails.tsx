import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Building, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

const CourseDetails = () => {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const { data: course, isLoading: courseLoading } = useQuery({
        queryKey: ["course", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("courses")
                .select("*")
                .eq("id", id!)
                .single();
            if (error) throw error;
            return data;
        },
        enabled: !!id,
    });

    const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
        queryKey: ["reviews", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("reviews")
                .select("*")
                .eq("course_id", id!)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
        enabled: !!id,
    });

    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
        percent: reviews.length > 0
            ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
            : 0,
    }));

    const handleReviewSubmitted = () => {
        queryClient.invalidateQueries({ queryKey: ["reviews", id] });
        queryClient.invalidateQueries({ queryKey: ["courses"] });
    };

    if (courseLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container py-12">
                    <div className="h-8 w-48 animate-pulse rounded bg-muted mb-4" />
                    <div className="h-12 w-96 animate-pulse rounded bg-muted mb-2" />
                    <div className="h-6 w-64 animate-pulse rounded bg-muted" />
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container py-20 text-center">
                    <p className="text-lg text-muted-foreground">Course not found.</p>
                    <Link to="/" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                        <ArrowLeft className="h-4 w-4" /> Back to courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container py-8">
                <Link
                    to="/"
                    className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to courses
                </Link>

                {/* Course Header */}
                <div className="mb-10">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-primary/10 px-3 py-1 font-display text-sm font-semibold text-primary">
                            {course.code}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Tag className="h-3.5 w-3.5" /> {course.department}
                        </span>
                    </div>
                    <h1 className="mb-2 font-display text-3xl font-bold text-foreground md:text-4xl">
                        {course.name}
                    </h1>
                    <p className="mb-4 flex items-center gap-2 text-muted-foreground">
                        <Building className="h-4 w-4" /> {course.university}
                    </p>
                    {course.description && (
                        <p className="max-w-2xl text-muted-foreground leading-relaxed">
                            {course.description}
                        </p>
                    )}
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left: Reviews */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Rating Summary */}
                        <div className="rounded-lg border border-border bg-card p-6">
                            <div className="flex flex-col items-center gap-6 sm:flex-row">
                                <div className="text-center">
                                    <div className="font-display text-5xl font-bold text-foreground">
                                        {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                                    </div>
                                    <StarRating rating={avgRating} size="md" />
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                    {ratingDistribution.map((d) => (
                                        <div key={d.star} className="flex items-center gap-2">
                                            <span className="w-4 text-right text-xs font-medium text-muted-foreground">
                                                {d.star}
                                            </span>
                                            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full rounded-full bg-star-filled transition-all duration-500"
                                                    style={{ width: `${d.percent}%` }}
                                                />
                                            </div>
                                            <span className="w-6 text-right text-xs text-muted-foreground">
                                                {d.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Review List */}
                        <h2 className="font-display text-xl font-semibold text-foreground">
                            Student Reviews
                        </h2>
                        {reviewsLoading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
                                ))}
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="rounded-lg border border-border bg-card p-8 text-center">
                                <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                                <p className="text-muted-foreground">
                                    No reviews yet. Be the first to review this course!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <ReviewCard
                                        key={review.id}
                                        reviewerName={review.reviewer_name}
                                        rating={review.rating}
                                        comment={review.comment}
                                        createdAt={review.created_at}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Review Form */}
                    <div>
                        <div className="sticky top-24">
                            <ReviewForm courseId={course.id} onSubmitted={handleReviewSubmitted} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
