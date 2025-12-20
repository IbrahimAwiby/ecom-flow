import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Grid,
  List,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { wishlistService } from "@/services/wishlist.service";
import { cartService } from "@/services/cart.service";
import { cn } from "@/lib/utils";

export default function WishlistPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { items, setItems, removeItem } = useWishlistStore();
  const { setCart, setCartCount, setCartId } = useCartStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { isLoading, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      try {
        const data = await wishlistService.getWishlist();
        setItems(data.data || []);
        return data;
      } catch (error) {
        toast({
          title: "Failed to load wishlist",
          description: "Please try again later",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 1,
  });

  const removeMutation = useMutation({
    mutationFn: wishlistService.removeFromWishlist,
    onSuccess: (_, productId) => {
      removeItem(productId);
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your saved items",
      });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => {
      toast({
        title: "Failed to remove item",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: (data) => {
      setCart(data.data);
      setCartCount(data.numOfCartItems);
      setCartId(data.cartId);
      toast({
        title: "Added to cart!",
        description: "Item has been moved to your shopping cart",
      });
    },
    onError: () => {
      toast({
        title: "Failed to add to cart",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleMoveToCart = async (productId: string) => {
    try {
      await addToCartMutation.mutateAsync(productId);
      removeMutation.mutate(productId);
    } catch (error) {
      // Error handled by mutation callbacks
    }
  };

  const handleRemoveItem = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeMutation.mutate(productId);
  };

  const handleClearAll = async () => {
    if (items.length === 0) return;

    const confirm = window.confirm(
      "Are you sure you want to clear your entire wishlist?"
    );
    if (!confirm) return;

    try {
      // Remove items one by one
      for (const item of items) {
        await wishlistService.removeFromWishlist(item._id);
      }
      setItems([]);
      toast({
        title: "Wishlist cleared",
        description: "All items have been removed from your wishlist",
      });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    } catch (error) {
      toast({
        title: "Failed to clear wishlist",
        description: "Some items could not be removed",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-6 sm:px-6 sm:py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* View Toggle Skeleton */}
        <div className="mb-6 flex justify-end">
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4">
                <Skeleton className="mb-2 h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/10">
      <div className="container px-3 py-4 sm:px-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Heart className="h-7 w-7 sm:h-8 sm:w-8 text-primary fill-primary/20" />
                <Badge
                  className="absolute -right-2 -top-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  variant="destructive"
                >
                  {items.length}
                </Badge>
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
                  My Wishlist
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {items.length} {items.length === 1 ? "item" : "items"} saved
                  for later
                </p>
              </div>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  disabled={removeMutation.isPending}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>

                {/* View Toggle - Desktop */}
                <div className="hidden sm:flex">
                  <Tabs
                    value={viewMode}
                    onValueChange={(v) => setViewMode(v as "grid" | "list")}
                  >
                    <TabsList>
                      <TabsTrigger value="grid" className="h-9 w-9 p-0">
                        <Grid className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="list" className="h-9 w-9 p-0">
                        <List className="h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/30 py-16 sm:py-24 backdrop-blur-sm">
            <div className="text-center px-4">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Save products you love by clicking the heart icon. They'll
                appear here for easy access.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-xl">
                  <Link to="/products">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Discover Products
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                >
                  <Link to="/products?sort=-ratingsAverage">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    View Top Rated
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile View Toggle & Stats */}
            <div className="mb-6 flex flex-col gap-4 sm:hidden">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </Badge>
                <Tabs
                  value={viewMode}
                  onValueChange={(v) => setViewMode(v as "grid" | "list")}
                >
                  <TabsList>
                    <TabsTrigger value="grid" className="h-9 w-9 p-0">
                      <Grid className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="list" className="h-9 w-9 p-0">
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Wishlist Items */}
            <div
              className={cn(
                "gap-4",
                viewMode === "grid"
                  ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "flex flex-col gap-4"
              )}
            >
              {items.map((product) => (
                <Card
                  key={product._id}
                  className={cn(
                    "overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 group",
                    viewMode === "list" && "flex"
                  )}
                >
                  {/* Product Image */}
                  <Link
                    to={`/products/${product._id}`}
                    className={cn(
                      "relative block overflow-hidden bg-muted",
                      viewMode === "grid"
                        ? "aspect-square w-full"
                        : "aspect-square w-24 xs:w-32 sm:w-40 shrink-0"
                    )}
                  >
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Discount Badge */}
                    {product.priceAfterDiscount &&
                      product.priceAfterDiscount < product.price && (
                        <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">
                          Save{" "}
                          {Math.round(
                            ((product.price - product.priceAfterDiscount) /
                              product.price) *
                              100
                          )}
                          %
                        </Badge>
                      )}

                    {/* Quick Remove Button */}
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => handleRemoveItem(product._id, e)}
                      disabled={removeMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Link>

                  <div
                    className={cn(
                      "flex flex-1 flex-col",
                      viewMode === "list" && "p-4"
                    )}
                  >
                    <CardContent
                      className={cn(
                        "p-4 pb-0",
                        viewMode === "list" && "p-0 flex-1"
                      )}
                    >
                      {/* Product Title */}
                      <Link to={`/products/${product._id}`} className="block">
                        <h3
                          className={cn(
                            "font-medium hover:text-primary transition-colors",
                            viewMode === "grid"
                              ? "line-clamp-2 text-sm sm:text-base"
                              : "line-clamp-1 text-base sm:text-lg"
                          )}
                        >
                          {product.title}
                        </h3>

                        {/* Category */}
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                          {product.category?.name}
                        </p>
                      </Link>

                      {/* Price */}
                      <div className="mt-2 sm:mt-3 flex items-center gap-2">
                        <span
                          className={cn(
                            "font-bold",
                            viewMode === "grid" ? "text-lg" : "text-xl"
                          )}
                        >
                          ${product.priceAfterDiscount || product.price}
                        </span>
                        {product.priceAfterDiscount &&
                          product.priceAfterDiscount < product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.price}
                            </span>
                          )}
                      </div>

                      {/* Ratings */}
                      {product.ratingsAverage && (
                        <div className="mt-2 flex items-center gap-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={cn(
                                  "text-sm",
                                  star <= Math.round(product.ratingsAverage)
                                    ? "text-yellow-500"
                                    : "text-muted"
                                )}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({product.ratingsQuantity})
                          </span>
                        </div>
                      )}
                    </CardContent>

                    {/* Actions */}
                    <CardFooter
                      className={cn(
                        "p-4 pt-3",
                        viewMode === "list" && "p-0 mt-3"
                      )}
                    >
                      <div className="flex w-full gap-2">
                        <Button
                          size={viewMode === "list" ? "default" : "sm"}
                          className="flex-1"
                          onClick={() => handleMoveToCart(product._id)}
                          disabled={
                            addToCartMutation.isPending ||
                            removeMutation.isPending
                          }
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {viewMode === "list" ? "Move to Cart" : "Add to Cart"}
                        </Button>

                        {/* Mobile Remove Button */}
                        <Button
                          size={viewMode === "list" ? "icon" : "sm"}
                          variant="outline"
                          className={cn(
                            "sm:hidden",
                            viewMode === "list" && "w-10"
                          )}
                          onClick={(e) => handleRemoveItem(product._id, e)}
                          disabled={removeMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <div>
                <h3 className="text-lg font-semibold">Ready to checkout?</h3>
                <p className="text-sm text-muted-foreground">
                  Move your favorite items to cart for purchase
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link to="/products">Continue Shopping</Link>
                </Button>
                <Button asChild>
                  <Link to="/cart">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Cart
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Don't forget to import useState
import { useState } from "react";
