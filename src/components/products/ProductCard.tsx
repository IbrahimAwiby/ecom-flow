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

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(product._id),
    onSuccess: (data) => {
      setCart(data.data);
      setCartCount(data.numOfCartItems);
      setCartId(data.cartId);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: () =>
      inWishlist
        ? wishlistService.removeFromWishlist(product._id)
        : wishlistService.addToWishlist(product._id),
    onSuccess: () => {
      if (inWishlist) {
        removeItem(product._id);
        toast({
          title: "Removed from wishlist",
          description: `${product.title} has been removed from your wishlist.`,
        });
      } else {
        addItem(product);
        toast({
          title: "Added to wishlist",
          description: `${product.title} has been added to your wishlist.`,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive",
      });
      return;
    }
    addToCartMutation.mutate();
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to wishlist.",
        variant: "destructive",
      });
      return;
    }
    wishlistMutation.mutate();
  };

  const discount = product.priceAfterDiscount
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : 0;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-elevated">
      <Link to={`/products/${product._id}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          <img
            src={product.imageCover}
            alt={product.title}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-destructive px-2 py-1 text-xs font-semibold text-destructive-foreground">
              -{discount}%
            </span>
          )}

          {/* Wishlist Button */}
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "absolute right-3 top-3 h-8 w-8 rounded-full opacity-0 transition-all group-hover:opacity-100",
              inWishlist && "opacity-100 bg-destructive hover:bg-destructive/90"
            )}
            onClick={handleWishlistToggle}
            disabled={wishlistMutation.isPending}
          >
            <Heart
              className={cn("h-4 w-4", inWishlist && "fill-current text-destructive-foreground")}
            />
          </Button>
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <p className="text-xs font-medium text-muted-foreground">
            {product.category?.name}
          </p>

          {/* Title */}
          <h3 className="mt-1 line-clamp-2 font-medium leading-tight group-hover:text-primary">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{product.ratingsAverage}</span>
            <span className="text-xs text-muted-foreground">
              ({product.ratingsQuantity})
            </span>
          </div>

          {/* Price & Cart */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">
                ${product.priceAfterDiscount || product.price}
              </span>
              {product.priceAfterDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price}
                </span>
              )}
            </div>

            <Button
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
