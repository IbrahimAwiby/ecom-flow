import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Calendar,
  ShoppingBag,
  User,
  Home,
  Copy,
  Printer,
  Download,
  Shield,
  Sparkles,
  ExternalLink,
  Box,
  Hash,
  Receipt,
  Tag,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ordersService } from "@/services/orders.service";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("items");

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersService.getOrderById(id!),
    enabled: !!id,
    retry: 1,
  });

  const getStatusIcon = () => {
    if (!order) return null;
    if (order.isDelivered)
      return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />;
    if (order.isPaid) return <Truck className="h-4 w-4 sm:h-5 sm:w-5" />;
    return <Clock className="h-4 w-4 sm:h-5 sm:w-5" />;
  };

  const getStatusText = () => {
    if (!order) return "";
    if (order.isDelivered) return "Delivered";
    if (order.isPaid) return "Shipped";
    return "Processing";
  };

  const getStatusColor = () => {
    if (!order) return "";
    if (order.isDelivered)
      return "bg-green-500/10 text-green-600 border-green-500/20";
    if (order.isPaid) return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  };

  const getStatusBgColor = () => {
    if (!order) return "";
    if (order.isDelivered)
      return "bg-gradient-to-r from-green-500/5 to-green-500/10";
    if (order.isPaid) return "bg-gradient-to-r from-blue-500/5 to-blue-500/10";
    return "bg-gradient-to-r from-yellow-500/5 to-yellow-500/10";
  };

  const handleCopyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order._id);
    toast({
      title: "Order ID copied",
      description: "Order ID has been copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <div className="container px-4 py-6 sm:px-6 sm:py-8 md:py-10">
          <Skeleton className="mb-6 h-6 w-32" />
          <Skeleton className="mb-6 h-24 w-full rounded-xl" />
          <Skeleton className="mb-4 h-64 rounded-xl" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="container px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h1 className="text-xl sm:text-2xl font-bold mb-2">
                Order Not Found
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                {error
                  ? "Unable to load order details. Please try again."
                  : "The order you're looking for doesn't exist or has been removed."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/orders">View All Orders</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      <div className="container px-4 py-6 sm:px-6 sm:py-8 md:py-10">
        {/* Back Button & Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4 group hover:bg-transparent"
          >
            <Link to="/orders" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Orders</span>
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Package className="relative h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
                  Order Details
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1.5 text-xs sm:text-sm",
                      getStatusColor()
                    )}
                  >
                    {getStatusIcon()}
                    {getStatusText()}
                  </Badge>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    Placed{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyOrderId}
                className="hidden sm:inline-flex"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy ID
              </Button>
              <Button size="sm" asChild>
                <Link to="/products">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shop More
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Order Info Card */}
        <Card
          className={cn("mb-6 border-l-4 border-l-primary", getStatusBgColor())}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Hash className="h-3 w-3" />
                  Order ID
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm font-medium truncate">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 sm:hidden"
                    onClick={handleCopyOrderId}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Order Date
                </p>
                <p className="text-sm font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Receipt className="h-3 w-3" />
                  Total Amount
                </p>
                <p className="text-lg sm:text-xl font-bold text-primary">
                  ${order.totalOrderPrice}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Payment Status
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "gap-1",
                    order.isPaid
                      ? "bg-green-500/10 text-green-600 border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                  )}
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mobile Tabs */}
            <div className="lg:hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>
                <TabsContent value="items" className="mt-4">
                  <OrderItemsSection order={order} />
                </TabsContent>
                <TabsContent value="shipping" className="mt-4">
                  <ShippingSection order={order} />
                </TabsContent>
                <TabsContent value="summary" className="mt-4">
                  <OrderSummarySection order={order} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Desktop Content (No Tabs) */}
            <div className="hidden lg:block space-y-6">
              <OrderItemsSection order={order} />
              <ShippingSection order={order} />
              <OrderSummarySection order={order} />
            </div>

            {/* Delivery Status */}
            {order.isDelivered && order.deliveredAt && (
              <Card className="bg-gradient-to-r from-green-500/5 to-green-500/10 border-green-500/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        Successfully Delivered
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Your order was delivered on{" "}
                        {new Date(order.deliveredAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      <div className="flex gap-3">
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/contact">Need Help?</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/products">Buy Again</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={`/orders`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    All Orders
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Invoice
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  disabled
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/contact">
                    <Shield className="mr-2 h-4 w-4" />
                    Get Help
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  {order.paymentMethodType === "cash" ? (
                    <Banknote className="h-6 w-6 text-green-600" />
                  ) : (
                    <CreditCard className="h-6 w-6 text-primary" />
                  )}
                  <div>
                    <p className="font-medium">
                      {order.paymentMethodType === "cash"
                        ? "Cash on Delivery"
                        : "Paid Online"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.isPaid ? "Payment completed" : "Payment pending"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      $
                      {order.totalOrderPrice -
                        (order.shippingPrice || 0) -
                        (order.taxPrice || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {(order.shippingPrice || 0) > 0
                        ? `$${order.shippingPrice}`
                        : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${order.taxPrice || 0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg text-primary">
                      ${order.totalOrderPrice}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Need Help Card */}
            <Card className="bg-gradient-to-r from-primary/5 via-transparent to-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team is available 24/7 to assist you.
                </p>
                <div className="space-y-3">
                  <Button size="sm" asChild className="w-full">
                    <Link to="/contact">Contact Support</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="w-full"
                  >
                    <Link to="/faq">View FAQ</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Components for Tab Content
function OrderItemsSection({ order }: { order: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="h-5 w-5" />
          Order Items ({order.cartItems.length})
        </CardTitle>
        <CardDescription>All products included in this order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {order.cartItems.map((item: any) => (
            <div
              key={item._id}
              className="flex gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
            >
              <Link to={`/products/${item.product._id}`} className="shrink-0">
                <div className="relative">
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover border"
                  />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {item.count}
                  </Badge>
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <Link
                      to={`/products/${item.product._id}`}
                      className="font-medium hover:text-primary line-clamp-2 text-sm sm:text-base"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${item.price} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      ${item.price * item.count}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <Link to={`/products/${item.product._id}`}>
                        <ExternalLink className="mr-1 h-3 w-3" />
                        View Product
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ShippingSection({ order }: { order: any }) {
  if (!order.shippingAddress) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Address
        </CardTitle>
        <CardDescription>Where your order will be delivered</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/30">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{order.shippingAddress.details}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {order.shippingAddress.city}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {order.isPaid && !order.isDelivered && (
            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">In Transit</p>
                  <p className="text-xs text-muted-foreground">
                    Your order is on its way to you
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function OrderSummarySection({ order }: { order: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>
              $
              {order.totalOrderPrice -
                (order.shippingPrice || 0) -
                (order.taxPrice || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {(order.shippingPrice || 0) > 0
                ? `$${order.shippingPrice}`
                : "Free"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>${order.taxPrice || 0}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">${order.totalOrderPrice}</span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Order Status</p>
              <p className="text-sm text-muted-foreground">
                {order.isDelivered
                  ? "Delivered"
                  : order.isPaid
                  ? "Shipped"
                  : "Processing"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Customer Support</p>
              <p className="text-sm text-muted-foreground">
                24/7 available via chat and email
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
