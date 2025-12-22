import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  ShoppingBag,
  Calendar,
  CreditCard,
  MapPin,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Receipt,
  Box,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";
import { ordersService } from "@/services/orders.service";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersService.getUserOrders(),
    enabled: isAuthenticated,
    retry: 1,
  });

  // Ensure orders is always an array
  const orders = Array.isArray(response) ? response : [];

  // Filter orders based on active filter
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "delivered") return order.isDelivered;
    if (activeFilter === "shipped") return order.isPaid && !order.isDelivered;
    if (activeFilter === "processing") return !order.isPaid;
    return true;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "highest") {
      return b.totalOrderPrice - a.totalOrderPrice;
    }
    if (sortBy === "lowest") {
      return a.totalOrderPrice - b.totalOrderPrice;
    }
    return 0;
  });

  const getStatusIcon = (order: (typeof orders)[0]) => {
    if (order.isDelivered)
      return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />;
    if (order.isPaid) return <Truck className="h-3 w-3 sm:h-4 sm:w-4" />;
    return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />;
  };

  const getStatusText = (order: (typeof orders)[0]) => {
    if (order.isDelivered) return "Delivered";
    if (order.isPaid) return "Shipped";
    return "Processing";
  };

  const getStatusColor = (order: (typeof orders)[0]) => {
    if (order.isDelivered)
      return "bg-green-500/10 text-green-600 border-green-500/20";
    if (order.isPaid) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  };

  const getStatusBgColor = (order: (typeof orders)[0]) => {
    if (order.isDelivered)
      return "bg-gradient-to-r from-green-500/5 to-green-500/10";
    if (order.isPaid) return "bg-gradient-to-r from-blue-500/5 to-blue-500/10";
    return "bg-gradient-to-r from-yellow-500/5 to-yellow-500/10";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container px-4 py-6 sm:px-6 sm:py-8 md:py-10">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-48 mb-4" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>

          {/* Tabs Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          {/* Orders Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Failed to load orders
            </h2>
            <p className="text-muted-foreground mb-6">
              Please try refreshing the page or contact support if the problem
              persists.
            </p>
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      <div className="container px-4 py-6 sm:px-6 sm:py-8 md:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Package className="relative h-7 w-7 sm:h-9 sm:w-9 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
                  My Orders
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Track and manage all your purchases
                </p>
              </div>
            </div>

            {orders.length > 0 && (
              <div className="flex items-center gap-2 sm:gap-3">
                <Badge variant="outline" className="gap-2 text-xs sm:text-sm">
                  <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                  {orders.length} orders
                </Badge>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  <Link to="/products">
                    <Sparkles className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Shop More
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
            <CardContent className="p-3 sm:p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold">
                    {orders.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold">
                    $
                    {orders
                      .reduce((sum, order) => sum + order.totalOrderPrice, 0)
                      .toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold">
                    {orders.filter((o) => o.isDelivered).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold">
                    {orders.filter((o) => !o.isPaid).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Processing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/30 py-12 sm:py-16 backdrop-blur-sm">
            <div className="text-center px-4">
              <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold">
                No orders yet
              </h2>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                Your order history will appear here once you start shopping.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="sm" className="rounded-lg sm:rounded-xl">
                  <Link to="/products">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Shopping
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-lg sm:rounded-xl"
                >
                  <Link to="/products?sort=-ratingsAverage">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Top Rated
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filters & Sort */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                {/* Desktop Tabs */}
                <div className="hidden sm:block w-full">
                  <Tabs
                    value={activeFilter}
                    onValueChange={setActiveFilter}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-4 w-full max-w-2xl">
                      <TabsTrigger value="all" className="text-sm">
                        All ({orders.length})
                      </TabsTrigger>
                      <TabsTrigger value="processing" className="text-sm">
                        Processing ({orders.filter((o) => !o.isPaid).length})
                      </TabsTrigger>
                      <TabsTrigger value="shipped" className="text-sm">
                        Shipped (
                        {
                          orders.filter((o) => o.isPaid && !o.isDelivered)
                            .length
                        }
                        )
                      </TabsTrigger>
                      <TabsTrigger value="delivered" className="text-sm">
                        Delivered ({orders.filter((o) => o.isDelivered).length})
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Mobile Filter Dropdown */}
                <div className="sm:hidden w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          Filter:{" "}
                          {activeFilter.charAt(0).toUpperCase() +
                            activeFilter.slice(1)}
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Filter Orders</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => setActiveFilter("all")}
                        >
                          All ({orders.length})
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setActiveFilter("processing")}
                        >
                          Processing ({orders.filter((o) => !o.isPaid).length})
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setActiveFilter("shipped")}
                        >
                          Shipped (
                          {
                            orders.filter((o) => o.isPaid && !o.isDelivered)
                              .length
                          }
                          )
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setActiveFilter("delivered")}
                        >
                          Delivered (
                          {orders.filter((o) => o.isDelivered).length})
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Sort Dropdown */}
                <div className="w-full sm:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span>Sort by: </span>
                          <span className="font-medium">
                            {sortBy === "newest" && "Newest"}
                            {sortBy === "oldest" && "Oldest"}
                            {sortBy === "highest" && "Highest Price"}
                            {sortBy === "lowest" && "Lowest Price"}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Sort Orders</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setSortBy("newest")}>
                          Newest First
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                          Oldest First
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("highest")}>
                          Highest Price
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("lowest")}>
                          Lowest Price
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {filteredOrders.length === 0 && activeFilter !== "all" && (
                <div className="mt-4 text-center py-6 rounded-lg bg-muted/30">
                  <Package className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    No {activeFilter} orders found
                  </p>
                </div>
              )}
            </div>

            {/* Orders Grid - Responsive Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {sortedOrders.map((order) => (
                <Card
                  key={order._id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50 group h-full"
                >
                  <CardHeader
                    className={cn("pb-2 px-3 sm:px-4", getStatusBgColor(order))}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Receipt className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="text-xs sm:text-sm font-mono font-medium truncate">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1 px-2 py-0.5 sm:px-3 sm:py-1.5 text-xs font-medium",
                          getStatusColor(order)
                        )}
                      >
                        {getStatusIcon(order)}
                        <span className="hidden xs:inline">
                          {getStatusText(order)}
                        </span>
                        <span className="xs:hidden">
                          {getStatusText(order).charAt(0)}
                        </span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-4">
                      {/* Products Preview */}
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold mb-2 flex items-center gap-2">
                          <Box className="h-3 w-3 sm:h-4 sm:w-4" />
                          Items ({order.cartItems.length})
                        </h3>
                        <div className="flex -space-x-2 overflow-hidden">
                          {order.cartItems.slice(0, 4).map((item) => (
                            <div key={item._id} className="relative group/item">
                              <img
                                src={item.product.imageCover}
                                alt={item.product.title}
                                className="h-10 w-10 sm:h-12 sm:w-12 rounded border border-background object-cover transition-transform group-hover/item:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 rounded flex items-center justify-center">
                                <span className="text-xs text-white font-medium">
                                  x{item.count}
                                </span>
                              </div>
                            </div>
                          ))}
                          {order.cartItems.length > 4 && (
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded border border-background bg-muted flex items-center justify-center text-xs font-medium">
                              +{order.cartItems.length - 4}
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      {/* Order Details */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <CreditCard className="h-3 w-3" />
                            Payment
                          </p>
                          <p className="text-xs sm:text-sm font-medium truncate">
                            {order.paymentMethodType === "cash"
                              ? "COD"
                              : "Paid Online"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            Shipping
                          </p>
                          <p className="text-xs sm:text-sm font-medium truncate">
                            {order.shippingAddress?.city || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Section */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Total Amount
                          </p>
                          <p className="text-lg sm:text-xl font-bold text-primary">
                            ${order.totalOrderPrice}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex-1 sm:flex-none group/btn text-xs"
                          >
                            <Link to={`/orders/${order._id}`}>
                              Details
                              <ExternalLink className="ml-1 h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                            </Link>
                          </Button>
                          {order.isDelivered && (
                            <Button
                              size="sm"
                              asChild
                              className="flex-1 sm:flex-none text-xs"
                            >
                              <Link
                                to={`/products/${order.cartItems[0]?.product?._id}`}
                              >
                                Buy Again
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Need help with an order?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our support team is ready to assist you.
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 sm:flex-none"
                  >
                    <Link to="/faq">FAQ</Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1 sm:flex-none">
                    <Link to="/contact">Contact</Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
