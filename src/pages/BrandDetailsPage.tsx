import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  ArrowLeft,
  Package,
  Star,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  Search,
  Filter,
  Grid3x3,
  List,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { brandsService } from "@/services/brands.service";
import { productsService } from "@/services/products.service";

export default function BrandDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [sortBy, setSortBy] = useState("-createdAt");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: brandData,
    isLoading: brandLoading,
    isError: brandError,
  } = useQuery({
    queryKey: ["brand", id],
    queryFn: () => brandsService.getById(id!),
    enabled: !!id,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products", "brand", id, sortBy, searchQuery],
    queryFn: () =>
      productsService.getAll({
        brand: id,
        sort: sortBy,
        keyword: searchQuery || undefined,
      }),
    enabled: !!id,
  });

  const brand = brandData?.data;
  const products = productsData?.data || [];
  const totalProducts = productsData?.results || 0;

  // Filter products by search query
  const filteredProducts = searchQuery
    ? products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  if (brandLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-6">
          {/* Breadcrumb skeleton */}
          <div className="mb-6 flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <ChevronRight className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
            <ChevronRight className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Brand header skeleton */}
          <div className="mb-8 flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Products skeleton */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (brandError || !brand) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-8">
        <div className="text-center max-w-md mx-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <Package className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Brand not found</h1>
          <p className="mt-2 text-muted-foreground">
            The brand you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="mt-6">
            <Link to="/brands">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Brands
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-4 sm:mb-6 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto">
          <Link to="/" className="hover:text-foreground whitespace-nowrap">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
          <Link
            to="/brands"
            className="hover:text-foreground whitespace-nowrap"
          >
            Brands
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
          <span className="text-foreground truncate">{brand.name}</span>
        </nav>

        {/* Brand Hero */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="relative">
            <div className="flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center rounded-xl sm:rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 p-4 shadow-lg">
              <img
                src={brand.image}
                alt={brand.name}
                className="h-full w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150x150?text=Brand";
                }}
              />
            </div>
            <Badge className="absolute -right-2 -top-2 sm:-right-2 sm:-top-2 gap-1 bg-primary">
              <Star className="h-3 w-3" />
              Official
            </Badge>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 mb-2 sm:mb-3">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">
                Premium Brand
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
              {brand.name}
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
              {totalProducts} premium products available
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-2">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">{totalProducts}</p>
                <p className="text-xs text-muted-foreground">Products</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">4.8</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-green-500/10 p-2">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">100+</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">Premium</p>
                <p className="text-xs text-muted-foreground">Tier</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Section */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                {brand.name} Products
              </h2>
              <p className="text-sm text-muted-foreground">
                Discover our collection of {brand.name} products
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden sm:flex items-center rounded-lg border p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 sm:w-48 h-9 sm:h-10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-createdAt">Newest</SelectItem>
                  <SelectItem value="-price">Price: High to Low</SelectItem>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="-sold">Best Selling</SelectItem>
                  <SelectItem value="-ratingsAverage">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search in ${brand.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {totalProducts}
              </span>{" "}
              products
            </p>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1 text-xs">
                Search: "{searchQuery}"
              </Badge>
            )}
          </div>
        </div>

        {/* Products Section */}
        <section>
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  {searchQuery
                    ? `No products found matching "${searchQuery}" from ${brand.name}`
                    : `No products available from ${brand.name} brand`}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-lg"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={product.imageCover}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="font-semibold text-primary">
                        ${product.price}
                      </span>
                      {product.priceAfterDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.priceAfterDiscount}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Related Brands */}
        <section className="mt-8 sm:mt-12">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold">
              Explore Other Brands
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover more premium brands
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Browse all brands
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link to="/brands">View All</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
