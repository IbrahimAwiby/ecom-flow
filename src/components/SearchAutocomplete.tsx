import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { productsService } from "@/services/products.service";
import { cn } from "@/lib/utils";

interface SearchAutocompleteProps {
  className?: string;
  onSearch?: () => void;
}

export function SearchAutocomplete({ className, onSearch }: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["products", "search", debouncedQuery],
    queryFn: () => productsService.getAll({ keyword: debouncedQuery, limit: 5 }),
    enabled: debouncedQuery.length >= 2,
  });

  const products = suggestions?.data || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsOpen(false);
      onSearch?.();
    }
  };

  const handleSelectProduct = (productId: string) => {
    navigate(`/products/${productId}`);
    setQuery("");
    setIsOpen(false);
    onSearch?.();
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(e.target.value.length >= 2);
            }}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            className="pl-10 pr-10 bg-muted/50"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-popover shadow-elevated z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : products.length > 0 ? (
            <ul className="py-2">
              {products.map((product) => (
                <li key={product._id}>
                  <button
                    type="button"
                    onClick={() => handleSelectProduct(product._id)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-left"
                  >
                    <img
                      src={product.imageCover}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.title}</p>
                      <p className="text-xs text-muted-foreground">
                        ${product.priceAfterDiscount || product.price}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
              <li className="border-t border-border mt-2 pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full px-4 py-2 text-sm text-primary hover:bg-muted transition-colors text-center"
                >
                  View all results for "{query}"
                </button>
              </li>
            </ul>
          ) : debouncedQuery.length >= 2 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No products found for "{debouncedQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
