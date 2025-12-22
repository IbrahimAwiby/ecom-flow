import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { cartService } from "@/services/cart.service";
import { wishlistService } from "@/services/wishlist.service";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { setCart, setCartCount, setCartId } = useCartStore();
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const [imageLoaded, setImageLoaded] = useState(false);

  const inWishlist = isInWishlist(product._id);

  const discount = product.priceAfterDiscount
    ? Math.round(
        ((product.price - product.priceAfterDiscount) / product.price) * 100
      )
    : 0;

  /* ---------------- Cart Mutation ---------------- */
  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(product._id),
    onSuccess: (data) => {
      setCart(data.data);
      setCartCount(data.numOfCartItems);
      setCartId(data.cartId);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Added to cart",
        description: `${product.title} added successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not add item to cart.",
        variant: "destructive",
      });
    },
  });

  /* ---------------- Wishlist Mutation ---------------- */
  const wishlistMutation = useMutation({
    mutationFn: () =>
      inWishlist
        ? wishlistService.removeFromWishlist(product._id)
        : wishlistService.addToWishlist(product._id),
    onSuccess: () => {
      inWishlist ? removeItem(product._id) : addItem(product);
      toast({
        title: inWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: product.title,
      });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const requireAuth = (cb: () => void) => {
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "Login required to continue.",
        variant: "destructive",
      });
      return;
    }
    cb();
  };

  return (
    <Card className="group relative overflow-hidden rounded-xl transition hover:shadow-lg">
      <Link to={`/products/${product._id}`} className="block h-full">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}

          <img
            src={product.imageCover}
            alt={product.title}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition duration-500 group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Discount */}
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-destructive px-2 py-1 text-xs font-semibold text-white">
              -{discount}%
            </span>
          )}

          {/* Wishlist */}
          <Button
            aria-label="Add to wishlist"
            size="icon"
            variant="secondary"
            className={cn(
              "absolute right-3 top-3 h-8 w-8 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
              inWishlist && "bg-destructive hover:bg-destructive/90"
            )}
            onClick={(e) => {
              e.preventDefault();
              requireAuth(() => wishlistMutation.mutate());
            }}
          >
            <Heart
              className={cn("h-4 w-4", inWishlist && "fill-current text-white")}
            />
          </Button>
        </div>

        <CardContent className="p-4 space-y-2">
          {/* Category */}
          <p className="text-xs text-muted-foreground">
            {product.category?.name}
          </p>

          {/* Title */}
          <h3 className="line-clamp-2 font-medium leading-tight transition-colors group-hover:text-primary">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="font-medium">{product.ratingsAverage}</span>
            <span className="text-xs text-muted-foreground">
              ({product.ratingsQuantity})
            </span>
          </div>

          {/* Price & Cart */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <span className="text-lg font-bold text-primary">
                ${product.priceAfterDiscount || product.price}
              </span>

              {product.priceAfterDiscount && (
                <span className="text-sm line-through text-muted-foreground">
                  ${product.price}
                </span>
              )}
            </div>

            <Button
              aria-label="Add to cart"
              size="icon"
              className="h-9 w-9 rounded-full"
              disabled={addToCartMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                requireAuth(() => addToCartMutation.mutate());
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
