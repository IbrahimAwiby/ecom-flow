import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Banknote,
  Loader2,
  MapPin,
  Package,
  Shield,
  Truck,
  Clock,
  CheckCircle,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  Home,
  Building,
  Navigation,
  ChevronRight,
  AlertCircle,
  Smartphone,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/cart.store";
import { cartService } from "@/services/cart.service";
import { addressesService } from "@/services/addresses.service";
import { ordersService } from "@/services/orders.service";
import { cn } from "@/lib/utils";

const checkoutSchema = z.object({
  details: z.string().min(5, "Please enter your address"),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, "Please enter a valid phone number"),
  city: z.string().min(2, "City is required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"saved" | "new">("saved");
  const { cart, cartId, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.getCart,
  });

  const { data: addressesData } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressesService.getAll,
  });

  const addresses = addressesData?.data || [];
  const cartItems = cartData?.data?.products || cart?.products || [];
  const totalPrice =
    cartData?.data?.totalCartPrice || cart?.totalCartPrice || 0;
  const currentCartId = cartData?.cartId || cartId;

  const handleSelectAddress = (address: (typeof addresses)[0]) => {
    setSelectedAddress(address._id);
    setValue("details", address.details);
    setValue("phone", address.phone);
    setValue("city", address.city);
    setActiveTab("saved");
  };

  const handleUseNewAddress = () => {
    setSelectedAddress(null);
    reset();
    setActiveTab("new");
  };

  const getAddressIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("home"))
      return <Home className="h-4 w-4 text-blue-500" />;
    if (lowerName.includes("office") || lowerName.includes("work"))
      return <Building className="h-4 w-4 text-purple-500" />;
    return <Navigation className="h-4 w-4 text-green-500" />;
  };

  const cashOrderMutation = useMutation({
    mutationFn: (data: CheckoutForm) =>
      ordersService.createCashOrder(currentCartId!, {
        shippingAddress: {
          details: data.details!,
          phone: data.phone!,
          city: data.city!,
        },
      }),
    onSuccess: (response) => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "🎉 Order Placed Successfully!",
        description:
          "Your order has been confirmed. You'll receive a confirmation email shortly.",
      });
      navigate("/orders");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Place Order",
        description:
          error.response?.data?.message ||
          "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const cardOrderMutation = useMutation({
    mutationFn: (data: CheckoutForm) =>
      ordersService.createCheckoutSession(currentCartId!, {
        shippingAddress: {
          details: data.details!,
          phone: data.phone!,
          city: data.city!,
        },
      }),
    onSuccess: (data) => {
      window.location.href = data.session.url;
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description:
          error.response?.data?.message ||
          "Please try again or use cash payment.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    if (paymentMethod === "cash") {
      cashOrderMutation.mutate(data);
    } else {
      cardOrderMutation.mutate(data);
    }
  };

  const isPending = cashOrderMutation.isPending || cardOrderMutation.isPending;

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
        <div className="container px-4 py-6">
          <Skeleton className="mb-6 h-8 w-40" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/10">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add items to your cart to proceed to checkout
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg">
                <div onClick={() => navigate("/products")}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Shopping
                </div>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <div onClick={() => navigate("/cart")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  View Cart
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      <div className="container px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4 px-0 hover:bg-transparent"
          >
            <div
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Cart</span>
            </div>
          </Button>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <CreditCard className="relative h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold">
                  Checkout
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Complete your order
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs sm:text-sm">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Desktop Grid Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {/* Left Column - Address & Payment (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription>
                    Where should we deliver your order?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {addresses.length > 0 && (
                    <div className="space-y-4">
                      <Tabs
                        value={activeTab}
                        onValueChange={(v) =>
                          setActiveTab(v as "saved" | "new")
                        }
                      >
                        <TabsList className="grid grid-cols-2">
                          <TabsTrigger value="saved" className="text-sm">
                            Saved Addresses
                          </TabsTrigger>
                          <TabsTrigger value="new" className="text-sm">
                            New Address
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="saved" className="mt-4">
                          <div className="grid gap-3">
                            {addresses.map((address) => (
                              <button
                                key={address._id}
                                type="button"
                                onClick={() => handleSelectAddress(address)}
                                className={cn(
                                  "group rounded-xl border p-4 text-left transition-all duration-300",
                                  selectedAddress === address._id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50 hover:shadow-md"
                                )}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-background/50">
                                      {getAddressIcon(address.name)}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="font-semibold">
                                          {address.name}
                                        </p>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {address.name
                                            .toLowerCase()
                                            .includes("home")
                                            ? "Home"
                                            : address.name
                                                .toLowerCase()
                                                .includes("office") ||
                                              address.name
                                                .toLowerCase()
                                                .includes("work")
                                            ? "Work"
                                            : "Other"}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {address.details}
                                      </p>
                                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                        <span>{address.city}</span>
                                        <span>•</span>
                                        <span>{address.phone}</span>
                                      </div>
                                    </div>
                                  </div>
                                  {selectedAddress === address._id && (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full mt-4"
                            onClick={handleUseNewAddress}
                          >
                            Use New Address
                          </Button>
                        </TabsContent>

                        <TabsContent value="new" className="mt-4">
                          <AddressFormFields
                            register={register}
                            errors={errors}
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}

                  {addresses.length === 0 && (
                    <AddressFormFields register={register} errors={errors} />
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Choose how you want to pay</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) =>
                      setPaymentMethod(v as "cash" | "card")
                    }
                    className="space-y-3"
                  >
                    <div
                      className={cn(
                        "rounded-xl border p-4 transition-all duration-300",
                        paymentMethod === "cash"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <label className="flex cursor-pointer items-center gap-3">
                        <RadioGroupItem value="cash" className="h-5 w-5" />
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <Banknote className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">Cash on Delivery</p>
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform",
                                paymentMethod === "cash"
                                  ? "translate-x-1 text-primary"
                                  : ""
                              )}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pay when you receive your order
                          </p>
                        </div>
                      </label>
                    </div>

                    <div
                      className={cn(
                        "rounded-xl border p-4 transition-all duration-300",
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <label className="flex cursor-pointer items-center gap-3">
                        <RadioGroupItem value="card" className="h-5 w-5" />
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <CreditCard className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">Credit / Debit Card</p>
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform",
                                paymentMethod === "card"
                                  ? "translate-x-1 text-primary"
                                  : ""
                              )}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Secure online payment (Visa, MasterCard, etc.)
                          </p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>

                  {/* Security Badge */}
                  <div className="mt-6 p-4 rounded-lg bg-muted/30 flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Secure Payment</p>
                      <p className="text-sm text-muted-foreground">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary (1/3 width) */}
            <div className="space-y-6">
              <Card className="sticky top-24 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">
                      {cartItems.length} Items
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {cartItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
                        >
                          <div className="relative">
                            <img
                              src={item.product.imageCover}
                              alt={item.product.title}
                              className="h-14 w-14 rounded-lg object-cover border"
                            />
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {item.count}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary">
                              {item.product.title}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-muted-foreground">
                                ${item.price} each
                              </p>
                              <p className="font-medium">
                                ${item.price * item.count}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Order Info */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>Standard delivery: 3-5 business days</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Easy 30-day returns</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-xl group"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : paymentMethod === "cash" ? (
                      <>
                        Place Order
                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        Pay ${totalPrice}
                        <CreditCard className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {/* Security Note */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground">
                      By completing your purchase you agree to our{" "}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {/* Mobile Order Summary First */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${totalPrice}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
                <CardDescription className="text-sm">
                  Where should we deliver your order?
                </CardDescription>
              </CardHeader>
              <CardContent>
                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {/* Mobile-Friendly Address Selector */}
                    <Select
                      value={selectedAddress || "new"}
                      onValueChange={(value) => {
                        if (value === "new") {
                          handleUseNewAddress();
                        } else {
                          const address = addresses.find(
                            (a) => a._id === value
                          );
                          if (address) handleSelectAddress(address);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an address" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.map((address) => (
                          <SelectItem key={address._id} value={address._id}>
                            <div className="flex items-center gap-2">
                              {getAddressIcon(address.name)}
                              <span>{address.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="new">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Add New Address</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Show selected address details */}
                    {selectedAddress && (
                      <div className="mt-4 p-3 rounded-lg bg-muted/30">
                        {(() => {
                          const address = addresses.find(
                            (a) => a._id === selectedAddress
                          );
                          if (!address) return null;
                          return (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                {getAddressIcon(address.name)}
                                <p className="font-medium">{address.name}</p>
                                <Badge variant="outline" className="text-xs">
                                  {address.name.toLowerCase().includes("home")
                                    ? "Home"
                                    : address.name
                                        .toLowerCase()
                                        .includes("office") ||
                                      address.name
                                        .toLowerCase()
                                        .includes("work")
                                    ? "Work"
                                    : "Other"}
                                </Badge>
                              </div>
                              <p className="text-sm">{address.details}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {address.city} • {address.phone}
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* New Address Form (when selected) */}
                    {(!selectedAddress || selectedAddress === "new") && (
                      <div className="mt-4">
                        <AddressFormFields
                          register={register}
                          errors={errors}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <AddressFormFields register={register} errors={errors} />
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription className="text-sm">
                  Choose how you want to pay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as "cash" | "card")}
                  className="space-y-3"
                >
                  <div
                    className={cn(
                      "rounded-xl border p-3 transition-all duration-300",
                      paymentMethod === "cash"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <label className="flex cursor-pointer items-start gap-3">
                      <RadioGroupItem value="cash" className="mt-0.5 h-4 w-4" />
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-green-500/10">
                            <Banknote className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-sm">
                                Cash on Delivery
                              </p>
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 text-muted-foreground transition-transform",
                                  paymentMethod === "cash"
                                    ? "translate-x-1 text-primary"
                                    : ""
                                )}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Pay when you receive your order
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div
                    className={cn(
                      "rounded-xl border p-3 transition-all duration-300",
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <label className="flex cursor-pointer items-start gap-3">
                      <RadioGroupItem value="card" className="mt-0.5 h-4 w-4" />
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-500/10">
                            <CreditCard className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-sm">
                                Credit / Debit Card
                              </p>
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 text-muted-foreground transition-transform",
                                  paymentMethod === "card"
                                    ? "translate-x-1 text-primary"
                                    : ""
                                )}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Secure online payment (Visa, MasterCard, etc.)
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>

                {/* Security Badge */}
                <div className="mt-4 p-3 rounded-lg bg-muted/30 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5" />
                  Order Items ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={item.product.imageCover}
                          alt={item.product.title}
                          className="h-14 w-14 rounded-lg object-cover border"
                        />
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {item.count}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product.title}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">
                            ${item.price} each
                          </p>
                          <p className="font-medium">
                            ${item.price * item.count}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mobile Submit Button */}
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        ${totalPrice}
                      </p>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-xl"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : paymentMethod === "cash" ? (
                        "Place Order"
                      ) : (
                        "Pay Now"
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>Secure payment • 30-day returns</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}

// Address Form Fields Component
function AddressFormFields({ register, errors }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="details" className="text-sm">
          Address Details
        </Label>
        <Input
          id="details"
          placeholder="Street, building, floor..."
          {...register("details")}
          className="h-11 text-sm"
        />
        {errors.details && (
          <p className="text-xs text-destructive">{errors.details.message}</p>
        )}
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm">
            City
          </Label>
          <Input
            id="city"
            placeholder="Cairo"
            {...register("city")}
            className="h-11 text-sm"
          />
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm flex items-center gap-2">
            <Smartphone className="h-3 w-3" />
            Phone Number
          </Label>
          <Input
            id="phone"
            placeholder="01012345678"
            {...register("phone")}
            className="h-11 text-sm"
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
