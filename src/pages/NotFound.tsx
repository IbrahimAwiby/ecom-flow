import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Store } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error - User tried to access:", location.pathname);
  }, [location.pathname]);

  // Essential e-commerce sections only
  const quickLinks = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="w-5 h-5" />,
      description: "Return to homepage",
    },
    {
      name: "Categories",
      path: "/categories",
      icon: <ShoppingBag className="w-5 h-5" />,
      description: "Browse by category",
    },
    {
      name: "Brands",
      path: "/brands",
      icon: <Store className="w-5 h-5" />,
      description: "Shop by brand",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center space-y-6">
          {/* Error Code - Compact */}
          <div className="relative">
            <div className="text-9xl font-bold text-gray-200 dark:text-gray-700">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                Oops!
              </span>
            </div>
          </div>

          {/* Message - Brief */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Page not found
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We can't find what you're looking for.
            </p>
          </div>

          {/* Quick Links - Compact Grid */}
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try one of these instead:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => navigate(link.path)}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors group"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
                      {link.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {link.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons - Side by Side */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-2.5 px-4 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-1.5" />
              Home
            </button>
          </div>

          {/* Current Path - Minimal */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Path:{" "}
              <code className="ml-1 text-gray-700 dark:text-gray-300">
                {location.pathname}
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
