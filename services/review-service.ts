/**
 * Review service. Reviews aren't mutable in this phase (no review-writing
 * flow exists yet), but reads still go through this service rather than a
 * direct mock-data import, keeping the dependency direction UI -> services
 * -> mock consistent everywhere.
 */
import { reviews as seedReviews } from '@/data/mock-data';
import type { Review } from '@/types';

export function getReviewsByBusinessId(businessId: string): Review[] {
  return seedReviews.filter((r) => r.businessId === businessId);
}
