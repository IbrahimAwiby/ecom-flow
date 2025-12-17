import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, ShoppingCart, Star, Minus, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { productsService } from "@/services/products.service";
import { cartService } from "@/services/cart.service";
import { wishlistService } from "@/services/wishlist.service";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { ProductReviews } from "@/components/products/ProductReviews";
import { cn } from "@/lib/utils";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { isAuthenticated } = useAuthStore();
  const { setCart, setCartCount, setCartId } = useCartStore();
  const { isInWishlist, addItem, removeItem } = useWishlistStore();

  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getById(id!),
    enabled: !!id,
  });

  const product = productData?.data;
  const inWishlist = product ? isInWishlist(product._id) : false;

  // Related products
  const { data: relatedData, isLoading: relatedLoading } = useQuery({
    queryKey: ["products", "related", product?.category?._id],
    queryFn: () => productsService.getAll({ category: product?.category?._id, limit: 4 }),
    enabled: !!product?.category?._id,
  });

  const relatedProducts = relatedData?.data.filter((p) => p._id !== id) || [];

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(product!._id),
    onSuccess: (data) => {
      setCart(data.data);
      setCartCount(data.numOfCartItems);
      setCartId(data.cartId);
      toast({
        title: "Added to cart",
        description: `${product!.title} has been added to your cart.`,
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
        ? wishlistService.removeFromWishlist(product!._id)
        : wishlistService.addToWishlist(product!._id),
    onSuccess: () => {
      if (inWishlist) {
        removeItem(product!._id);
        toast({ title: "Removed from wishlist" });
      } else {
        addItem(product!);
        toast({ title: "Added to wishlist" });
      }
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive",
      });
      return;
    }
    // Add multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCartMutation.mutate();
    }
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to be logged in to use wishlist.",
        variant: "destructive",
      });
      return;
    }
    wishlistMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button asChild className="mt-4">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const images = [product.imageCover, ...product.images];
  const discount = product.priceAfterDiscount
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : 0;

  return (
    <div className="container py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/products" className="hover:text-foreground">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                  selectedImage === i ? "border-primary" : "border-transparent"
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Category & Brand */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              to={`/categories/${product.category._id}`}
              className="hover:text-primary"
            >
              {product.category.name}
            </Link>
            <span>•</span>
            <Link
              to={`/brands/${product.brand._id}`}
              className="hover:text-primary"
            >
              {product.brand.name}
            </Link>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl font-bold">{product.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-warning text-warning" />
              <span className="font-medium">{product.ratingsAverage}</span>
            </div>
            <span className="text-muted-foreground">
              ({product.ratingsQuantity} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-primary">
              ${product.priceAfterDiscount || product.price}
            </span>
            {product.priceAfterDiscount && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  ${product.price}
                </span>
                <span className="rounded-full bg-destructive px-3 py-1 text-sm font-semibold text-destructive-foreground">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground">{product.description}</p>

          {/* Stock */}
          <p className="text-sm">
            {product.quantity > 0 ? (
              <span className="text-success">In Stock ({product.quantity} available)</span>
            ) : (
              <span className="text-destructive">Out of Stock</span>
            )}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending || product.quantity === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleWishlistToggle}
              disabled={wishlistMutation.isPending}
            >
              <Heart
                className={cn("h-5 w-5", inWishlist && "fill-current text-destructive")}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Reviews */}
      <ProductReviews
        productId={product._id}
        ratingsAverage={product.ratingsAverage}
        ratingsQuantity={product.ratingsQuantity}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-8 font-display text-2xl font-bold">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : relatedProducts.slice(0, 4).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
          </div>
        </section>
      )}
    </div>
  );
}
