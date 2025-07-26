import { Link } from "@tanstack/react-router";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-foreground">
                Inventory Manager
              </h1>
            </div>

            <NavigationMenu>
              <NavigationMenuList className="flex space-x-1">
                <NavigationMenuItem>
                  <Link to="/">
                    {({ isActive }) => (
                      <Button
                        variant="ghost"
                        className={cn(
                          "transition-colors",
                          isActive &&
                            "bg-accent text-accent-foreground font-semibold"
                        )}
                      >
                        Home
                      </Button>
                    )}
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/products">
                    {({ isActive }) => (
                      <Button
                        variant="ghost"
                        className={cn(
                          "transition-colors",
                          isActive &&
                            "bg-accent text-accent-foreground font-semibold"
                        )}
                      >
                        Products
                      </Button>
                    )}
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
