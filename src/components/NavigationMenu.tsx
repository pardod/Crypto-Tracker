import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "./auth/AuthDialog";
import { SearchCommand } from "./SearchCommand";
import { useEffect } from "react";

const MainNav = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const button = document.querySelector("[data-search-trigger]");
        if (button instanceof HTMLElement) button.click();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex justify-between items-center max-w-screen-xl mx-auto p-4">
      <NavigationMenu>
        <NavigationMenuList className="flex items-center justify-center gap-6">
          <NavigationMenuItem>
            <Link to="/" className="text-lg font-medium hover:text-accent">
              Home
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link
              to="/markets/trending"
              className="text-lg font-medium hover:text-accent"
            >
              Trending
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link
              to="/portfolio/overview"
              className="text-lg font-medium hover:text-accent"
            >
              Portfolio
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/news" className="text-lg font-medium hover:text-accent">
              News
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-4">
        <SearchCommand />
        {user ? (
          <>
            <span 
              onClick={() => navigate("/profile")}
              className="text-sm text-muted-foreground hover:text-accent cursor-pointer"
            >
              Welcome back, {user.email?.split("@")[0]}!
            </span>
            <Button variant="outline" onClick={() => signOut()}>
              Sign Out
            </Button>
          </>
        ) : (
          <AuthDialog />
        )}
      </div>
    </div>
  );
};

export default MainNav;