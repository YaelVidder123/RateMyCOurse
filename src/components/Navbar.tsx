import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg hero-gradient">
                        <GraduationCap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-display text-xl font-bold text-foreground">
                        RateMyCourse
                    </span>
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
