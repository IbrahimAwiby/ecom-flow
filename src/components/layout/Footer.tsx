import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

const footerLinks = {
  shop: [
    { name: "All Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Brands", href: "/brands" },
    { name: "New Arrivals", href: "/products?sort=new" },
  ],
  account: [
    { name: "My Account", href: "/profile" },
    { name: "Orders", href: "/orders" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Cart", href: "/cart" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribed:", email);
      setEmail("");
    }
  };

  return (
    <>
      {/* Scroll to Top Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 h-11 w-11 rounded-full border-border/50 bg-background/90 backdrop-blur-sm shadow-lg transition-all duration-300 z-50 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ChevronUp className="h-5 w-5" />
      </Button>

      <footer className="relative border-t border-border/50 bg-card/50 backdrop-blur-sm">
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="container py-10 md:py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            {/* Brand & Newsletter */}
            <div className="col-span-2 lg:col-span-2 space-y-5">
              <Link
                to="/"
                className="inline-flex items-center gap-3 group transition-transform hover:scale-[1.02]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 shadow-lg shadow-primary/20">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    ShopHub
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Premium Shopping
                  </p>
                </div>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Your destination for quality products, great prices, and
                exceptional service.
              </p>

              {/* Newsletter */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Join our newsletter</p>
                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Your email"
                      className="pl-10 h-11 border-border/50 focus:border-primary bg-background/50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="default"
                    className="h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all"
                  >
                    Subscribe
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground">
                  Stay updated with exclusive offers.
                </p>
              </div>
            </div>

            {/* Links Columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wider">
                  {category}
                </p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 hover:pl-1 block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social & Copyright */}
          <div className="mt-10 pt-8 border-t border-border/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} ShopHub. All rights reserved.
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <Link to="/privacy" className="hover:text-foreground">
                    Privacy
                  </Link>
                  <span className="text-border">•</span>
                  <Link to="/terms" className="hover:text-foreground">
                    Terms
                  </Link>
                  <span className="text-border">•</span>
                  <Link to="/cookies" className="hover:text-foreground">
                    Cookies
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="h-9 w-9 rounded-full border border-border/30 flex items-center justify-center text-muted-foreground hover:text-[#1877F2] hover:border-[#1877F2]/30 transition-all hover:scale-110"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="h-9 w-9 rounded-full border border-border/30 flex items-center justify-center text-muted-foreground hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30 transition-all hover:scale-110"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="h-9 w-9 rounded-full border border-border/30 flex items-center justify-center text-muted-foreground hover:text-[#E4405F] hover:border-[#E4405F]/30 transition-all hover:scale-110"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="h-9 w-9 rounded-full border border-border/30 flex items-center justify-center text-muted-foreground hover:text-[#FF0000] hover:border-[#FF0000]/30 transition-all hover:scale-110"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </footer>
    </>
  );
}
