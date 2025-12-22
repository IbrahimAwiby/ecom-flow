import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  ChevronRight,
  Share2,
  Package,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("description");

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
    queryFn: () =>
      productsService.getAll({ category: product?.category?._id, limit: 4 }),
    enabled: !!product?.category?._id,
  });

  const relatedProducts = relatedData?.data.filter((p) => p._id !== id) || [];

  const addToCartMutation = useMutation({
    mutationFn: () => cartService.addToCart(product!._id),
    onSuccess: (data) => {
      setCart(data.data);
      setCartCount(data.numOfCartItems);
      setCartId(data.cartId);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
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
        toast({
          title: "Removed from wishlist",
          description: "Product removed from your wishlist.",
        });
      } else {
        addItem(product!);
        toast({
          title: "Added to wishlist",
          description: "Product added to your wishlist.",
        });
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-4 sm:py-8">
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row">
            {/* Image skeleton */}
            <div className="w-full lg:w-1/2 space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="flex gap-2 overflow-x-auto pb-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-16 w-16 rounded-md flex-shrink-0"
                  />
                ))}
              </div>
            </div>

            {/* Content skeleton */}
            <div className="w-full lg:w-1/2 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-12 w-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <div className="text-center max-w-md mx-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <Package className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="mt-2 text-muted-foreground">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="mt-6">
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const images = [product.imageCover, ...product.images];
  const discount = product.priceAfterDiscount
    ? Math.round(
        ((product.price - product.priceAfterDiscount) / product.price) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-4 sm:py-8">
        {/* Breadcrumbs - Fixed spacing */}
        <nav className="mb-4 sm:mb-6 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground whitespace-nowrap">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
          <Link
            to="/products"
            className="hover:text-foreground whitespace-nowrap"
          >
            Products
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
          <span className="text-foreground truncate">{product.title}</span>
        </nav>

        {/* Main content - Fixed flex layout */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Images Section */}
          <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg sm:rounded-xl border border-border bg-muted">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
              {discount > 0 && (
                <Badge className="absolute left-2 top-2 bg-destructive text-xs">
                  -{discount}%
                </Badge>
              )}
            </div>

            {/* Thumbnails - Fixed scroll */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-md border-2 transition-all",
                    selectedImage === i
                      ? "border-primary"
                      : "border-transparent hover:border-border"
                  )}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
            {/* Category & Brand - Fixed layout */}
            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/categories/${product.category._id}`}>
                <Badge
                  variant="outline"
                  className="text-xs hover:bg-primary/10 cursor-pointer"
                >
                  {product.category.name}
                </Badge>
              </Link>

              <Link to={`/brands/${product.brand._id}`}>
                <Badge
                  variant="outline"
                  className="text-xs hover:bg-primary/10 cursor-pointer"
                >
                  {product.brand.name}
                </Badge>
              </Link>

              <Badge variant="secondary" className="ml-auto gap-1 text-xs">
                <Sparkles className="h-3 w-3" />
                Premium
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
              {product.title}
            </h1>

            {/* Rating and Sold - Stacked on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-medium">
                    {product.ratingsAverage.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.ratingsQuantity} reviews)
                </span>
              </div>
              <span className="hidden sm:block text-muted-foreground">•</span>
              <div className="text-sm text-muted-foreground">
                {product.sold || 0} sold
              </div>
            </div>

            {/* Price - Stacked better */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-primary">
                ${product.priceAfterDiscount || product.price}
              </span>
              {product.priceAfterDiscount && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.price}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    Save {discount}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.quantity > 0 ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    In Stock ({product.quantity} available)
                  </span>
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">Out of Stock</span>
                </>
              )}
            </div>

            {/* Features - Simplified grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg border">
                <Truck className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-medium">Free Shipping</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg border">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-xs font-medium">2-Year Warranty</p>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      setQuantity(Math.min(product.quantity, quantity + 1))
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground">
                  Max: {product.quantity}
                </span>
              </div>
            </div>

            {/* Actions - Stacked on mobile */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-12"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || product.quantity === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={handleWishlistToggle}
                  disabled={wishlistMutation.isPending}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      inWishlist && "fill-current text-destructive"
                    )}
                  />
                  <span className="ml-2">Wishlist</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                  <span className="ml-2">Share</span>
                </Button>
              </div>
            </div>

            {/* Additional Info - Simplified */}
            <Card className="border">
              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-3">
                  Product Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Brand</p>
                    <p className="font-medium">{product.brand.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{product.category.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">SKU</p>
                    <p className="font-medium">{product._id.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p
                      className={`font-medium ${
                        product.quantity > 0
                          ? "text-green-600"
                          : "text-destructive"
                      }`}
                    >
                      {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section - Improved mobile */}
        <div className="mt-6 sm:mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description" className="text-xs sm:text-sm">
                Description
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm">
                Reviews ({product.ratingsQuantity})
              </TabsTrigger>
              <TabsTrigger value="shipping" className="text-xs sm:text-sm">
                Shipping
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <ProductReviews
                productId={product._id}
                ratingsAverage={product.ratingsAverage}
                ratingsQuantity={product.ratingsQuantity}
              />
            </TabsContent>

            <TabsContent value="shipping" className="mt-4">
              <Card>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">
                        Shipping Information
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Free shipping on orders over $50. Standard delivery
                        takes 3-5 business days. Express shipping available at
                        checkout.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">
                        Returns & Exchanges
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Easy 30-day return policy. Items must be in original
                        condition with all tags attached.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-8 sm:mt-12">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold">Related Products</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You might also like these products
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {relatedLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : relatedProducts
                    .slice(0, 4)
                    .map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}

        {/* Recently Viewed Section */}
        <section className="mt-8 sm:mt-12">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold">Recently Viewed</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Based on your browsing history
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                  <Package className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Browse more products to see recommendations
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
