import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const reviewSchema = z.object({
    reviewer_name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
    comment: z.string().trim().max(1000, "Comment must be under 1000 characters").optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
    courseId: string;
    onSubmitted: () => void;
}

const ReviewForm = ({ courseId, onSubmitted }: ReviewFormProps) => {
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: { reviewer_name: "", comment: "" },
    });

    const onSubmit = async (values: ReviewFormValues) => {
        if (rating === 0) {
            toast({ title: "Please select a rating", variant: "destructive" });
            return;
        }

        setSubmitting(true);
        const { error } = await supabase.from("reviews").insert({
            course_id: courseId,
            rating,
            reviewer_name: values.reviewer_name,
            comment: values.comment || null,
        });

        setSubmitting(false);

        if (error) {
            toast({ title: "Failed to submit review", description: error.message, variant: "destructive" });
            return;
        }

        toast({ title: "Review submitted!", description: "Thank you for your feedback." });
        form.reset();
        setRating(0);
        onSubmitted();
    };

    return (
        <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-card-foreground">
                Write a Review
            </h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-card-foreground">
                            Your Rating
                        </label>
                        <StarRating rating={rating} onRate={setRating} size="lg" interactive />
                    </div>

                    <FormField
                        control={form.control}
                        name="reviewer_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Alex M." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Comment (optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Share your experience with this course..."
                                        rows={4}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={submitting} className="w-full gap-2">
                        <Send className="h-4 w-4" />
                        {submitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ReviewForm;
