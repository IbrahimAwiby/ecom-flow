import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/cart.store";
import { cartService } from "@/services/cart.service";

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

  // Add refetchOnMount to ensure fresh data when navigating to cart page
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
    refetchOnMount: true, // This ensures data is refetched when component mounts
    refetchOnWindowFocus: true, // Optional: refetch when window regains focus
  });

  // Use cartData from query instead of just cart store
  const cartItems = cartData?.data?.products || [];

  const updateMutation = useMutation({
    mutationFn: ({ productId, count }: { productId: string; count: number }) =>
      cartService.updateQuantity(productId, count),
    onSuccess: (data, { productId, count }) => {
      updateItemCount(productId, count);
      setCart(data.data); // Update store with fresh data
      setCartCount(data.numOfCartItems);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: (data, productId) => {
      removeItem(productId);
      setCart(data.data); // Update store with fresh data
      setCartCount(data.numOfCartItems);
      toast({ title: "Item removed from cart" });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: (data) => {
      clearCart();
      toast({ title: "Cart cleared" });
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
    <div className="container py-6 sm:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              Shopping Cart
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {cartItems.length} items
            </p>
          </div>
        </div>
        {cartItems.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()} // Add manual refresh button
            >
              Refresh Cart
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearMutation.mutate()}
              disabled={clearMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Add some products to get started
          </p>
          <Button asChild className="mt-6">
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <Card key={item._id} className="overflow-hidden">
                <div className="flex flex-col xs:flex-row">
                  <Link
                    to={`/products/${item.product._id}`}
                    className="aspect-video xs:aspect-square h-auto xs:h-28 sm:h-36 w-full xs:w-28 sm:w-36 shrink-0 overflow-hidden bg-muted"
                  >
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <CardContent className="flex flex-1 flex-col justify-between p-3 sm:p-4">
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
                    <div className="mt-3 sm:mt-0 flex items-center justify-between gap-2">
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
                      <div className="flex items-center gap-2 sm:gap-4">
                        <p className="text-base sm:text-lg font-bold text-primary">
                          ${item.price * item.count}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() =>
                            removeMutation.mutate(item.product._id)
                          }
                          disabled={removeMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartData?.data?.totalCartPrice || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-xl text-primary">
                    ${cartData?.data?.totalCartPrice || 0}
                  </span>
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
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
