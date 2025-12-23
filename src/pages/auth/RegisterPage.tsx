import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  Loader2,
  Check,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";

// Simplified validation schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z
      .string()
      .regex(
        /^01[0125][0-9]{8}$/,
        "Please enter a valid Egyptian phone number"
      ),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rePassword: z.string(),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

// Simple validation icon
const ValidationIcon = ({ isValid }: { isValid: boolean }) => {
  if (!isValid) return null;
  return <Check className="h-4 w-4 text-green-500" />;
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data, variables) => {
      if (data.token && data.user) {
        const userWithPhone = {
          ...data.user,
          phone: variables.phone,
        };

        login(userWithPhone, data.token);
        toast({
          title: "Account created successfully!",
          description: "Welcome to ShopHub",
        });
        navigate("/");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data as Required<RegisterForm>);
  };

  // Watch fields for real-time validation
  const nameValue = watch("name");
  const emailValue = watch("email");
  const phoneValue = watch("phone");
  const passwordValue = watch("password");
  const rePasswordValue = watch("rePassword");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            Join ShopHub and start shopping today
          </p>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  Full Name
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="Ibrahim Hassan"
                    className={cn(
                      "pr-10",
                      errors.name &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("name")}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ValidationIcon isValid={!!nameValue && !errors.name} />
                  </div>
                </div>
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className={cn(
                      "pr-10",
                      errors.email &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("email")}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ValidationIcon isValid={!!emailValue && !errors.email} />
                  </div>
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    placeholder="01012345678"
                    className={cn(
                      "pr-10",
                      errors.phone &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("phone")}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ValidationIcon isValid={!!phoneValue && !errors.phone} />
                  </div>
                </div>
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Egyptian format: 010, 011, 012, or 015 followed by 8 digits
                </p>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={cn(
                      "pr-10",
                      errors.password &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password field */}
              <div className="space-y-2">
                <Label htmlFor="rePassword" className="text-sm">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="rePassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={cn(
                      "pr-10",
                      errors.rePassword &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("rePassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.rePassword && (
                  <p className="text-xs text-destructive">
                    {errors.rePassword.message}
                  </p>
                )}
                {rePasswordValue && passwordValue === rePasswordValue && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Passwords match
                  </p>
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={registerMutation.isPending || !isValid}
                size="lg"
              >
                {registerMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in here
              </Link>
            </div>

            {/* Security note */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Your information is secure and encrypted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile benefits */}
        <div className="mt-6 md:hidden">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-sm font-medium">Secure</div>
              <div className="text-xs text-muted-foreground">Payments</div>
            </div>
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-sm font-medium">Fast</div>
              <div className="text-xs text-muted-foreground">Delivery</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
