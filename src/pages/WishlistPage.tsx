import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useWishlistStore } from "@/store/wishlist.store";
import { useCartStore } from "@/store/cart.store";
import { wishlistService } from "@/services/wishlist.service";
import { cartService } from "@/services/cart.service";

export default function WishlistPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { items, setItems, removeItem } = useWishlistStore();
  const { setCart, setCartCount, setCartId } = useCartStore();

  const { isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const data = await wishlistService.getWishlist();
      setItems(data.data);
      return data;
    },
  });

  const removeMutation = useMutation({
    mutationFn: wishlistService.removeFromWishlist,
    onSuccess: (_, productId) => {
      removeItem(productId);
      toast({ title: "Removed from wishlist" });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: (data) => {
      setCart(data.data);
      setCartCount(data.numOfCartItems);
      setCartId(data.cartId);
      toast({ title: "Added to cart" });
    },
  });

  const handleMoveToCart = async (productId: string) => {
    await addToCartMutation.mutateAsync(productId);
    removeMutation.mutate(productId);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-display text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">{items.length} items saved</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Start adding products you love
          </p>
          <Button asChild className="mt-6">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <div className="flex">
                <Link
                  to={`/products/${product._id}`}
                  className="aspect-square h-32 w-32 shrink-0 overflow-hidden bg-muted"
                >
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <CardContent className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <Link
                      to={`/products/${product._id}`}
                      className="line-clamp-2 font-medium hover:text-primary"
                    >
                      {product.title}
                    </Link>
                    <p className="mt-1 text-lg font-bold text-primary">
                      ${product.priceAfterDiscount || product.price}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleMoveToCart(product._id)}
                      disabled={addToCartMutation.isPending}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeMutation.mutate(product._id)}
                      disabled={removeMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
