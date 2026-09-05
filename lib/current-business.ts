/**
 * This phase's dashboard is scoped to a single business (the owner/manager
 * logged in always manages "The Gentleman's Cut", id 'b1'). Multi-business
 * / multi-tenant owner accounts are a future-backend concern (real auth +
 * authorization), so this constant is the one place that assumption lives.
 */
export const CURRENT_BUSINESS_ID = 'b1';
