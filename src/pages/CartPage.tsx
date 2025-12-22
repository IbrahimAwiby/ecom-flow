import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Sparkles,
  Package,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/cart.store";
import { cartService } from "@/services/cart.service";
import { useState } from "react";

export default function CartPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    cart,
    setCart,
    setCartCount,
    cartId,
    updateItemCount,
    removeItem,
    clearCart,
  } = useCartStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: cartData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const data = await cartService.getCart();
      setCart(data.data);
      setCartCount(data.numOfCartItems);
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const cartItems = cartData?.data?.products || [];

  const updateMutation = useMutation({
    mutationFn: ({ productId, count }: { productId: string; count: number }) =>
      cartService.updateQuantity(productId, count),
    onSuccess: (data, { productId, count }) => {
      updateItemCount(productId, count);
      setCart(data.data);
      setCartCount(data.numOfCartItems);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: (data, productId) => {
      removeItem(productId);
      setCart(data.data);
      setCartCount(data.numOfCartItems);
      toast({
        title: "Item removed from cart",
        description: "Product has been removed from your shopping cart",
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: (data) => {
      clearCart();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleUpdateQuantity = (
    productId: string,
    currentCount: number,
    delta: number
  ) => {
    const newCount = currentCount + delta;
    if (newCount < 1) return;
    updateMutation.mutate({ productId, count: newCount });
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Cart refreshed",
        description: "Your cart has been updated with the latest information",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh cart data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-lg" />
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
                <ShoppingCart className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                <Badge
                  className="absolute -right-2 -top-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  variant="default"
                >
                  {cartItems.length}
                </Badge>
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
                  Shopping Cart
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                  in your cart
                </p>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw
                    className={`mr-2 h-4 w-4 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  Refresh Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => clearMutation.mutate()}
                  disabled={clearMutation.isPending}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/30 py-16 sm:py-24 backdrop-blur-sm">
            <div className="text-center px-4">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <ShoppingCart className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold">
                Your cart is empty
              </h2>
              <p className="mt-2 sm:mt-3 text-muted-foreground max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet.
                Start shopping to fill it with amazing items!
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-xl">
                  <Link to="/products">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start Shopping
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                >
                  <Link to="/wishlist">
                    <Package className="mr-2 h-5 w-5" />
                    View Wishlist
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Stats */}
            <div className="mb-6 flex items-center justify-between sm:hidden">
              <Badge variant="outline" className="text-xs">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Total: ${cartData?.data?.totalCartPrice || 0}
              </div>
            </div>

            {/* Cart Content */}
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {cartItems.map((item) => (
                  <Card
                    key={item._id}
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50"
                  >
                    <div className="flex flex-col xs:flex-row">
                      <Link
                        to={`/products/${item.product._id}`}
                        className="aspect-video xs:aspect-square h-auto xs:h-28 sm:h-36 w-full xs:w-28 sm:w-36 shrink-0 overflow-hidden bg-muted group"
                      >
                        <img
                          src={item.product.imageCover}
                          alt={item.product.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </Link>
                      <CardContent className="flex flex-1 flex-col justify-between p-3 sm:p-4">
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <Link
                                to={`/products/${item.product._id}`}
                                className="line-clamp-2 text-sm sm:text-base font-medium hover:text-primary"
                              >
                                {item.product.title}
                              </Link>
                              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                                {item.product.category?.name}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 ml-2"
                              onClick={() =>
                                removeMutation.mutate(item.product._id)
                              }
                              disabled={removeMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.count,
                                  -1
                                )
                              }
                              disabled={updateMutation.isPending}
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">
                              {item.count}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.count,
                                  1
                                )
                              }
                              disabled={updateMutation.isPending}
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                              ${item.price} each
                            </p>
                            <p className="text-base sm:text-lg font-bold text-primary">
                              ${item.price * item.count}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-xl">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">
                          ${cartData?.data?.totalCartPrice || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Items</span>
                        <span>{cartItems.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-green-600 font-medium">Free</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          ${cartData?.data?.totalCartPrice || 0}
                        </span>
                      </div>
                    </div>
                    <Button asChild className="w-full" size="lg">
                      <Link to="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                    <div className="pt-4 text-xs text-muted-foreground text-center">
                      Free shipping on all orders • Secure checkout • 30-day
                      returns
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
              <div>
                <h3 className="text-lg font-semibold">Need help?</h3>
                <p className="text-sm text-muted-foreground">
                  Contact our support team or check our FAQ
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link to="/faq">View FAQ</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/products">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Shop More
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
