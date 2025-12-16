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
  const { cart, setCart, setCartCount, cartId, updateItemCount, removeItem, clearCart } = useCartStore();

  const { isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const data = await cartService.getCart();
      setCart(data.data);
      setCartCount(data.numOfCartItems);
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, count }: { productId: string; count: number }) =>
      cartService.updateQuantity(productId, count),
    onSuccess: (data, { productId, count }) => {
      updateItemCount(productId, count);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: (_, productId) => {
      removeItem(productId);
      toast({ title: "Item removed from cart" });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      clearCart();
      toast({ title: "Cart cleared" });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleUpdateQuantity = (productId: string, currentCount: number, delta: number) => {
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

  const cartItems = cart?.products || [];

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground">{cartItems.length} items</p>
          </div>
        </div>
        {cartItems.length > 0 && (
          <Button
            variant="outline"
            onClick={() => clearMutation.mutate()}
            disabled={clearMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
          </Button>
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
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item._id} className="overflow-hidden">
                <div className="flex">
                  <Link
                    to={`/products/${item.product._id}`}
                    className="aspect-square h-32 w-32 shrink-0 overflow-hidden bg-muted sm:h-40 sm:w-40"
                  >
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <CardContent className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <Link
                        to={`/products/${item.product._id}`}
                        className="line-clamp-2 font-medium hover:text-primary"
                      >
                        {item.product.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.product.category?.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(item.product._id, item.count, -1)
                          }
                          disabled={updateMutation.isPending}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.count}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(item.product._id, item.count, 1)
                          }
                          disabled={updateMutation.isPending}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-lg font-bold text-primary">
                          ${item.price * item.count}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMutation.mutate(item.product._id)}
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
                  <span>${cart?.totalCartPrice || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-xl text-primary">
                    ${cart?.totalCartPrice || 0}
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
