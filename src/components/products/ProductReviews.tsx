import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductReviewsProps {
  productId: string;
  ratingsAverage: number;
  ratingsQuantity: number;
}

export function ProductReviews({ productId, ratingsAverage, ratingsQuantity }: ProductReviewsProps) {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local storage for reviews (since API doesn't have review endpoint)
  const [reviews, setReviews] = useState<Review[]>(() => {
    const stored = localStorage.getItem(`reviews-${productId}`);
    return stored ? JSON.parse(stored) : [];
  });

  const saveReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    localStorage.setItem(`reviews-${productId}`, JSON.stringify(newReviews));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to be logged in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating.",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a review comment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newReview: Review = {
      id: Date.now().toString(),
      userId: user?._id || "",
      userName: user?.name || "Anonymous",
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };

    saveReviews([newReview, ...reviews]);
    setRating(0);
    setComment("");
    setIsSubmitting(false);

    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const allReviewsCount = ratingsQuantity + reviews.length;
  const displayAverage = reviews.length > 0
    ? ((ratingsAverage * ratingsQuantity + reviews.reduce((sum, r) => sum + r.rating, 0)) / allReviewsCount).toFixed(1)
    : ratingsAverage.toFixed(1);

  return (
    <section className="mt-16 border-t border-border pt-8">
      <h2 className="font-display text-2xl font-bold mb-8">Customer Reviews</h2>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="text-4xl font-bold">{displayAverage}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-5 w-5",
                    star <= Math.round(Number(displayAverage))
                      ? "fill-warning text-warning"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {allReviewsCount} review{allReviewsCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          {/* Star Rating Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Your Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors",
                      (hoverRating || rating) >= star
                        ? "fill-warning text-warning"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium mb-2 block">Your Review</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 && ratingsQuantity === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <>
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.userName}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-3 w-3",
                                star <= review.rating
                                  ? "fill-warning text-warning"
                                  : "text-muted-foreground"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
            {ratingsQuantity > 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                + {ratingsQuantity} more reviews from other platforms
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
