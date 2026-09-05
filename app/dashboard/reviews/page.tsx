'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { CURRENT_BUSINESS_ID } from '@/lib/current-business';
import { getReviewsByBusinessId } from '@/services/review-service';
import { EmptyState } from '@/components/common/empty-state';
import type { Review } from '@/types';

export default function ReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setReviews(getReviewsByBusinessId(CURRENT_BUSINESS_ID));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Reviews</h1>
          <p className="text-muted-foreground">Customer feedback for your shop.</p>
        </div>
        {averageRating && (
          <div className="flex items-center gap-1.5 rounded-card border border-border bg-card px-4 py-2 shrink-0">
            <Star className="h-4 w-4 text-warning fill-warning" />
            <span className="font-semibold text-foreground">{averageRating}</span>
            <span className="text-xs text-muted-foreground">({reviews.length})</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4" aria-busy="true" aria-live="polite">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-card border border-border bg-card p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-surface-elevated" />
                <div className="space-y-2">
                  <div className="h-3 w-28 rounded bg-surface-elevated" />
                  <div className="h-2.5 w-20 rounded bg-surface-elevated" />
                </div>
              </div>
              <div className="h-3 w-full rounded bg-surface-elevated mb-2" />
              <div className="h-3 w-2/3 rounded bg-surface-elevated" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" description="Customer reviews will show up here after their first completed visit." />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-card border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated text-sm font-semibold text-primary">
                    {review.customerName[0]}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{review.customerName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-warning fill-warning' : 'text-border'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
