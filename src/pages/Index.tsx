import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, GraduationCap, BookOpen, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import CourseCard from "@/components/CourseCard";
import Navbar from "@/components/Navbar";

interface CourseWithRating {
    id: string;
    name: string;
    code: string;
    university: string;
    department: string;
    description: string | null;
    average_rating: number;
    review_count: number;
}

const fetchCourses = async (search: string): Promise<CourseWithRating[]> => {
    let query = supabase.from("courses").select("*");

    if (search) {
        query = query.or(
            `name.ilike.%${search}%,code.ilike.%${search}%,university.ilike.%${search}%,department.ilike.%${search}%`
        );
    }

    const { data: courses, error } = await query.order("name");
    if (error) throw error;

    // Fetch ratings
    const { data: ratings } = await supabase.from("course_avg_ratings").select("*");
    const ratingMap = new Map(
        (ratings || []).map((r: { course_id: string; average_rating: number; review_count: number }) => [
            r.course_id,
            { average_rating: Number(r.average_rating), review_count: Number(r.review_count) },
        ])
    );

    return (courses || []).map((c) => {
        const rating = ratingMap.get(c.id);
        return {
            ...c,
            average_rating: rating?.average_rating || 0,
            review_count: rating?.review_count || 0,
        };
    });
};

const Index = () => {
    const [search, setSearch] = useState("");

    const { data: courses = [], isLoading } = useQuery({
        queryKey: ["courses", search],
        queryFn: () => fetchCourses(search),
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero */}
            <section className="hero-gradient px-4 py-20 text-center">
                <div className="container max-w-3xl">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground">
                        <GraduationCap className="h-4 w-4" />
                        Trusted by students everywhere
                    </div>
                    <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
                        Find the best courses,{" "}
                        <span className="opacity-80">rated by students.</span>
                    </h1>
                    <p className="mb-8 text-lg text-primary-foreground/70">
                        Real reviews from real students. Search thousands of courses and make informed decisions about your education.
                    </p>

                    <div className="relative mx-auto max-w-xl">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search courses, departments, or universities..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-14 rounded-xl border-none bg-card pl-12 text-base shadow-lg ring-0 focus-visible:ring-2 focus-visible:ring-primary/30"
                        />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-b border-border bg-card py-6">
                <div className="container flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-display font-semibold text-foreground">{courses.length}</span> Courses
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-star-filled" />
                        <span className="font-display font-semibold text-foreground">
                            {courses.reduce((sum, c) => sum + c.review_count, 0)}
                        </span> Reviews
                    </div>
                </div>
            </section>

            {/* Course Grid */}
            <section className="container py-12">
                {search && (
                    <p className="mb-6 text-sm text-muted-foreground">
                        {courses.length} result{courses.length !== 1 ? "s" : ""} for "{search}"
                    </p>
                )}

                {isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-lg text-muted-foreground">No courses found.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course, i) => (
                            <div
                                key={course.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
                            >
                                <CourseCard
                                    id={course.id}
                                    name={course.name}
                                    code={course.code}
                                    university={course.university}
                                    department={course.department}
                                    averageRating={course.average_rating}
                                    reviewCount={course.review_count}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground">
                <div className="container">
                    Built with ❤️ for students · RateMyCourse © {new Date().getFullYear()}
                </div>
            </footer>
        </div>
    );
};

export default Index;
