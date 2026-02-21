
-- Fix security definer view
CREATE OR REPLACE VIEW public.course_avg_ratings
WITH (security_invoker = true) AS
SELECT 
    course_id,
    ROUND(AVG(rating)::numeric, 1) AS average_rating,
    COUNT(*) AS review_count
FROM public.reviews
GROUP BY course_id;
