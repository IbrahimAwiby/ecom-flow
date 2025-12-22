import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  ArrowLeft,
  Package,
  Layers,
  Tag,
  Sparkles,
  ShoppingBag,
  Filter,
  Grid3x3,
  List,
  SearchIcon,
} from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { categoriesService } from "@/services/categories.service";
import { productsService } from "@/services/products.service";

export default function CategoryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [sortBy, setSortBy] = useState("-createdAt");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery({
    queryKey: ["category", id],
    queryFn: () => categoriesService.getById(id!),
    enabled: !!id,
  });

  const { data: subcategoriesData } = useQuery({
    queryKey: ["subcategories", id],
    queryFn: () => categoriesService.getSubcategories(id!),
    enabled: !!id,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products", "category", id, sortBy, searchQuery],
    queryFn: () =>
      productsService.getAll({
        category: id,
        sort: sortBy,
        keyword: searchQuery || undefined,
      }),
    enabled: !!id,
  });

  const category = categoryData?.data;
  const subcategories = subcategoriesData?.data || [];
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

  if (categoryLoading) {
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

          {/* Header skeleton */}
          <Skeleton className="h-48 w-full rounded-xl mb-8" />

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

  if (categoryError || !category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-8">
        <div className="text-center max-w-md mx-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <Package className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Category not found</h1>
          <p className="mt-2 text-muted-foreground">
            The category you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="mt-6">
            <Link to="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
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
            to="/categories"
            className="hover:text-foreground whitespace-nowrap"
          >
            Categories
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
          <span className="text-foreground truncate">{category.name}</span>
        </nav>

        {/* Category Hero */}
        <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-xl sm:rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent z-10" />
          <img
            src={category.image}
            alt={category.name}
            className="h-40 sm:h-48 md:h-56 w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/1200x400?text=Category";
            }}
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 backdrop-blur-sm px-3 py-1 mb-2 sm:mb-3 w-fit">
              <Layers className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">
                Category
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {category.name}
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-white/90">
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
                <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">
                  {subcategories.length}
                </p>
                <p className="text-xs text-muted-foreground">Subcategories</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">24/7</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold">100%</p>
                <p className="text-xs text-muted-foreground">Quality</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subcategories */}
        {subcategories.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Subcategories</h2>
                <p className="text-sm text-muted-foreground">
                  Browse specific collections
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <Link
                  key={sub._id}
                  to={`/products?category=${sub._id}`}
                  className="group relative rounded-full border border-border bg-card px-4 py-2 text-xs sm:text-sm transition-all hover:border-primary hover:bg-primary/5 hover:scale-105"
                >
                  {sub.name}
                  <span className="absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary transition-all group-hover:w-8" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Controls Section */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                {category.name} Products
              </h2>
              <p className="text-sm text-muted-foreground">
                Discover our collection of {category.name} products
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
            <Input
              placeholder={`Search in ${category.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  {searchQuery
                    ? `No products found matching "${searchQuery}" in ${category.name}`
                    : `No products available in ${category.name} category`}
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

        {/* Related Categories */}
        <section className="mt-8 sm:mt-12">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold">
              Explore Other Categories
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover more product collections
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <Layers className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Browse all categories
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link to="/categories">View All</Link>
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
