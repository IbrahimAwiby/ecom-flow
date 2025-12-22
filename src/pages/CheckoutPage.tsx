import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Banknote, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
  const { cart, cartId, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    setValue,
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
      console.log("Order created successfully:", response); // Debug log
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: "Order placed!",
        description: "Your order has been placed successfully.",
      });
      navigate("/orders");
    },
    onError: (error) => {
      console.error("Order creation error:", error); // Debug log
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
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
      <div className="container max-w-4xl py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <Button onClick={() => navigate("/products")} className="mt-4">
            Shop Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="mb-8 font-display text-3xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Saved Addresses */}
            {addresses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Saved Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  {addresses.map((address) => (
                    <button
                      key={address._id}
                      type="button"
                      onClick={() => handleSelectAddress(address)}
                      className={cn(
                        "rounded-lg border p-3 text-left transition-all",
                        selectedAddress === address._id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground"
                      )}
                    >
                      <p className="font-medium">{address.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.details}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.city} • {address.phone}
                      </p>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="details">Address Details</Label>
                  <Input
                    id="details"
                    placeholder="Street, building, floor..."
                    {...register("details")}
                  />
                  {errors.details && (
                    <p className="text-sm text-destructive">
                      {errors.details.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Cairo"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="01012345678"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as "cash" | "card")}
                  className="grid gap-3"
                >
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all",
                      paymentMethod === "cash"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <RadioGroupItem value="cash" />
                    <Banknote className="h-6 w-6 text-success" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Pay when you receive your order
                      </p>
                    </div>
                  </label>

                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all",
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <RadioGroupItem value="card" />
                    <CreditCard className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">Credit / Debit Card</p>
                      <p className="text-sm text-muted-foreground">
                        Secure online payment
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="max-h-64 space-y-3 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={item.product.imageCover}
                        alt={item.product.title}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="line-clamp-1 text-sm font-medium">
                          {item.product.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.count}
                        </p>
                      </div>
                      <p className="font-medium">${item.price * item.count}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-xl text-primary">${totalPrice}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isPending}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {paymentMethod === "cash" ? "Place Order" : "Pay Now"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
