
-- Courses table
CREATE TABLE public.courses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    university TEXT NOT NULL,
    department TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    reviewer_name TEXT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster review lookups
CREATE INDEX idx_reviews_course_id ON public.reviews(course_id);

-- Create view for average ratings
CREATE OR REPLACE VIEW public.course_avg_ratings AS
SELECT 
    course_id,
    ROUND(AVG(rating)::numeric, 1) AS average_rating,
    COUNT(*) AS review_count
FROM public.reviews
GROUP BY course_id;

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Courses: public read only
CREATE POLICY "Courses are publicly readable"
ON public.courses FOR SELECT USING (true);

-- Reviews: public read + insert
CREATE POLICY "Reviews are publicly readable"
ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Anyone can submit a review"
ON public.reviews FOR INSERT WITH CHECK (true);
