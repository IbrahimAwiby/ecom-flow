import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  Loader2,
  Check,
  Mail,
  Lock,
  ArrowRight,
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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

// Simple validation icon
const ValidationIcon = ({ isValid }: { isValid: boolean }) => {
  if (!isValid) return null;
  return <Check className="h-4 w-4 text-green-500" />;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Enable real-time validation
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.token && data.user) {
        login(data.user, data.token);
        toast({
          title: "Welcome back!",
          description: `Logged in as ${data.user.name}`,
        });
        navigate(from, { replace: true });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data as Required<LoginForm>);
  };

  // Watch fields for real-time validation
  const emailValue = watch("email");
  const passwordValue = watch("password");

  // Handle demo login
  const handleDemoLogin = () => {
    const demoCredentials = {
      email: "demo@example.com",
      password: "Demo@123",
    };

    // You can either auto-fill the form or directly login
    // For now, we'll just fill the form values
    console.log("Demo login would use:", demoCredentials);

    toast({
      title: "Demo Login",
      description: "Use demo@example.com / Demo@123 for testing",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground">
            Sign in to your account to continue shopping
          </p>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
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

              {/* Remember me checkbox - optional */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me for 30 days
                </Label>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={loginMutation.isPending || !isValid}
                size="lg"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign up link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Create an account
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

        {/* Quick links for mobile */}
        <div className="mt-6 md:hidden">
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/register"
              className="text-center p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <div className="text-sm font-medium text-primary">New User?</div>
              <div className="text-xs text-muted-foreground">
                Create Account
              </div>
            </Link>
            <Link
              to="/forgot-password"
              className="text-center p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <div className="text-sm font-medium text-primary">Need Help?</div>
              <div className="text-xs text-muted-foreground">
                Reset Password
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
