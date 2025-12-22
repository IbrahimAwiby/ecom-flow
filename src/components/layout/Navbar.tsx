import { useState, useEffect } from "react";
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
  Search,
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
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuthStore();
  const { cartCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check if link is active
  const isActiveLink = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-border/50 shadow-lg shadow-black/5 dark:shadow-black/20"
          : "bg-background/90 backdrop-blur-lg border-border/30"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section: Mobile Menu & Logo (mobile) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Button (only on mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 p-0 hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Logo (center on mobile, left on desktop) */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <ShoppingCart className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-foreground lg:block hidden">
                ShopHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActiveLink(link.href)
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {link.name}
                  {isActiveLink(link.href) && (
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center Section: Search (desktop only) */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <SearchAutocomplete />
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-1">
            {/* Desktop: All actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative h-10 w-10 p-0"
              >
                <Link to="/wishlist" className="relative">
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                      {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative h-10 w-10 p-0"
              >
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* User Menu / Auth */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 p-0 border-2 border-transparent hover:border-primary/20 transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-muted to-muted/80">
                        <User className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 border-border/50 shadow-xl"
                  >
                    <div className="flex flex-col space-y-1 p-3">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                      <Link to="/profile" className="flex items-center gap-3">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                      <Link to="/orders" className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                      <Link to="/addresses" className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Addresses</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    asChild
                    className="h-9 px-4 text-sm font-medium"
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="h-9 px-4 text-sm font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile: Theme toggle, Profile, Cart only */}
            <div className="flex lg:hidden items-center gap-1">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Profile Dropdown (mobile) */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 p-0"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 border-border/50 shadow-xl"
                  >
                    <div className="flex flex-col space-y-1 p-3">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                      <Link to="/profile" className="flex items-center gap-3">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                      <Link to="/orders" className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                      <Link to="/addresses" className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Addresses</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                      <Link to="/wishlist" className="flex items-center gap-3">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Wishlist</span>
                        {wishlistItems.length > 0 && (
                          <span className="ml-auto text-xs bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                            {wishlistItems.length}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-10 w-10 p-0"
                >
                  <Link to="/login">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )}

              {/* Cart (mobile) */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative h-10 w-10 p-0"
              >
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (contains search and navigation links) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 mt-2 py-4 animate-in slide-in-from-top duration-300">
            {/* Mobile Search */}
            <div className="mb-4 px-2">
              <SearchAutocomplete onSearch={() => setMobileMenuOpen(false)} />
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-1 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActiveLink(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Auth Links (only for non-authenticated) */}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
