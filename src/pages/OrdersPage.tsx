import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, ChevronRight, Clock, CheckCircle, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth.store";
import { ordersService } from "@/services/orders.service";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersService.getUserOrders(),
    enabled: isAuthenticated,
  });

  // Ensure orders is always an array
  const orders = Array.isArray(data) ? data : [];

  const getStatusIcon = (order: typeof orders[0]) => {
    if (order.isDelivered) return <CheckCircle className="h-5 w-5 text-success" />;
    if (order.isPaid) return <Truck className="h-5 w-5 text-info" />;
    return <Clock className="h-5 w-5 text-warning" />;
  };

  const getStatusText = (order: typeof orders[0]) => {
    if (order.isDelivered) return "Delivered";
    if (order.isPaid) return "Shipped";
    return "Processing";
  };

  const getStatusColor = (order: typeof orders[0]) => {
    if (order.isDelivered) return "bg-success/10 text-success border-success/20";
    if (order.isPaid) return "bg-info/10 text-info border-info/20";
    return "bg-warning/10 text-warning border-warning/20";
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8 flex items-center gap-3">
        <Package className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-display text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">{orders.length} orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Package className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-muted-foreground">
            Start shopping to see your orders here
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} to={`/orders/${order._id}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 pb-3 px-4 sm:px-6">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("gap-1 text-xs", getStatusColor(order))}
                  >
                    {getStatusIcon(order)}
                    <span className="hidden xs:inline">{getStatusText(order)}</span>
                  </Badge>
                </CardHeader>
                <CardContent className="p-3 sm:p-4">
                  {/* Items Preview */}
                  <div className="flex gap-2 overflow-x-auto pb-3">
                    {order.cartItems.slice(0, 4).map((item) => (
                      <img
                        key={item._id}
                        src={item.product.imageCover}
                        alt={item.product.title}
                        className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-lg object-cover"
                      />
                    ))}
                    {order.cartItems.length > 4 && (
                      <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-lg bg-muted text-xs sm:text-sm font-medium">
                        +{order.cartItems.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {order.cartItems.length} items •{" "}
                        {order.paymentMethodType === "cash" ? "COD" : "Paid"}
                      </p>
                      <p className="text-base sm:text-lg font-bold text-primary">
                        ${order.totalOrderPrice}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
