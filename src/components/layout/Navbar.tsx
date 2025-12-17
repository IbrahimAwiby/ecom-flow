import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  Package,
  MapPin,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "Brands", href: "/brands" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, logout } = useAuthStore();
  const { cartCount } = useCartStore();
  const { items: wishlistItems = [] } = useWishlistStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check if link is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - Enhanced */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 shadow-lg shadow-primary/20 group-hover:shadow-primary/30 group-hover:scale-105 transition-all duration-300">
            <ShoppingCart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              ShopHub
            </span>
            <span className="hidden text-xs font-medium text-muted-foreground/80 sm:inline-block tracking-wide">
              PREMIUM SHOPPING
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Enhanced with Active States */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link, index) => {
            const isActive = isActiveLink(link.href);
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:text-foreground group",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                {link.name}
                {isActive ? (
                  <span className="absolute bottom-0 left-1/2 w-3/5 h-0.5 bg-primary rounded-full -translate-x-1/2"></span>
                ) : (
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary rounded-full -translate-x-1/2 group-hover:w-3/5 transition-all duration-300"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search Bar - Enhanced */}
        <SearchAutocomplete className="hidden lg:flex flex-1 max-w-md mx-8 shadow-sm" />

        {/* Actions - Enhanced */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Wishlist - Enhanced */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={cn(
              "relative rounded-xl hover:bg-muted/80 transition-all duration-300 hover:scale-105",
              location.pathname === "/wishlist" && "bg-primary/10 text-primary"
            )}
          >
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-[10px] font-bold text-white shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
          </Button>

          {/* Cart - Enhanced */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className={cn(
              "relative rounded-xl hover:bg-muted/80 transition-all duration-300 hover:scale-105",
              location.pathname === "/cart" && "bg-primary/10 text-primary"
            )}
          >
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-[10px] font-bold text-primary-foreground shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          {/* User Menu - Enhanced */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-xl hover:bg-muted/80 transition-all duration-300",
                    location.pathname === "/profile" &&
                      "bg-primary/10 text-primary"
                  )}
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-xl border-border/50 shadow-xl backdrop-blur-xl bg-card/95"
              >
                <div className="flex flex-col space-y-1 p-3 border-b border-border/50">
                  <p className="text-sm font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    {user?.email}
                  </p>
                </div>
                <div className="p-1">
                  <DropdownMenuItem
                    asChild
                    className={cn(
                      "rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                      location.pathname === "/profile" &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 py-2"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className={cn(
                      "rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                      location.pathname === "/orders" &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    <Link to="/orders" className="flex items-center gap-3 py-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className={cn(
                      "rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                      location.pathname === "/addresses" &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    <Link
                      to="/addresses"
                      className="flex items-center gap-3 py-2"
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Addresses</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg hover:bg-destructive/10 text-destructive cursor-pointer transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                asChild
                className={cn(
                  "rounded-lg hover:bg-muted/80 transition-colors",
                  location.pathname === "/login" && "bg-primary/10 text-primary"
                )}
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm hover:shadow transition-all"
              >
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle - Enhanced */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl hover:bg-muted/80 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu - Enhanced with Active States */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-500 ease-in-out",
          mobileMenuOpen
            ? "max-h-96 border-t border-border/50 bg-card/95 backdrop-blur-xl"
            : "max-h-0"
        )}
      >
        <div className="container pb-6 pt-4 space-y-4">
          {/* Mobile Search - Enhanced */}
          <div className="px-1">
            <SearchAutocomplete onSearch={() => setMobileMenuOpen(false)} />
          </div>

          {/* Mobile Nav Links - Enhanced with Active States */}
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold hover:bg-primary/20"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:pl-6"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            {!isAuthenticated && (
              <>
                <div className="h-px bg-border/50 my-2"></div>
                <Link
                  to="/login"
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    location.pathname === "/login"
                      ? "bg-primary/10 text-primary font-semibold hover:bg-primary/20"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    location.pathname === "/register"
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-semibold"
                      : "bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:from-primary/20 hover:to-primary/10 hover:shadow-sm"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
