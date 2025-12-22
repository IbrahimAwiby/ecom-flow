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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ordersService } from "@/services/orders.service";
import { cn } from "@/lib/utils";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersService.getOrderById(id!),
    enabled: !!id,
  });

  // Remove this line - you're already getting the order directly from useQuery
  // const order = orders?.find((o) => o._id === id);

  const getStatusIcon = () => {
    if (!order) return null;
    if (order.isDelivered)
      return <CheckCircle className="h-5 w-5 text-success" />;
    if (order.isPaid) return <Truck className="h-5 w-5 text-info" />;
    return <Clock className="h-5 w-5 text-warning" />;
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
      return "bg-success/10 text-success border-success/20";
    if (order.isPaid) return "bg-info/10 text-info border-info/20";
    return "bg-warning/10 text-warning border-warning/20";
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-6 sm:py-8">
        <Skeleton className="mb-6 h-8 w-32" />
        <Skeleton className="mb-6 h-32 rounded-lg" />
        <Skeleton className="mb-4 h-48 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <Package className="mx-auto mb-4 h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
          <h1 className="text-xl sm:text-2xl font-bold">Order not found</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            {error
              ? "Error loading order"
              : "The order you're looking for doesn't exist."}
          </p>
          <Button asChild className="mt-6">
            <Link to="/orders">View All Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-6 sm:py-8 px-4 sm:px-6">
      {/* Back Button */}
      <Link
        to="/orders"
        className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 self-start sm:self-auto text-xs sm:text-sm py-1 px-2 sm:px-3",
            getStatusColor()
          )}
        >
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Order Items */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Package className="h-4 w-4 sm:h-5 sm:w-5" />
              Order Items ({order.cartItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            {order.cartItems.map((item) => (
              <div
                key={item._id}
                className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <Link to={`/products/${item.product._id}`}>
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover shrink-0"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product._id}`}
                    className="font-medium text-sm sm:text-base hover:text-primary line-clamp-2"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                    Qty: {item.count}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Unit price: ${item.price}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-sm sm:text-base text-primary">
                    ${item.price * item.count}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <Card>
            <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-2 text-sm sm:text-base">
                <p>{order.shippingAddress.details}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg">
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            {/* Payment Method */}
            <div className="flex items-center gap-3">
              {order.paymentMethodType === "cash" ? (
                <Banknote className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              ) : (
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              )}
              <span className="text-sm sm:text-base">
                {order.paymentMethodType === "cash"
                  ? "Cash on Delivery"
                  : "Paid Online"}
              </span>
              {order.isPaid && (
                <Badge
                  variant="outline"
                  className="bg-success/10 text-success border-success/20 text-xs"
                >
                  Paid
                </Badge>
              )}
            </div>

            <Separator />

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm sm:text-base">
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
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-base sm:text-lg">
              <span>Total</span>
              <span className="text-primary">${order.totalOrderPrice}</span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Info */}
        {order.isDelivered && order.deliveredAt && (
          <Card className="bg-success/5 border-success/20">
            <CardContent className="flex items-center gap-3 py-4 px-4 sm:px-6">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              <div>
                <p className="font-medium text-sm sm:text-base">Delivered</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {new Date(order.deliveredAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
