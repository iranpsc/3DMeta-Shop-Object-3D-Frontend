/**
 * Barrel re-exports for storefront API helpers.
 * Prefer importing from storefront-server-api (RSC) or storefront-client-api
 * (browser mutations) directly to keep server/client boundaries clear.
 */
export {
  fetchProducts,
  fetchHomeProducts,
  fetchPopularCategories,
  fetchTopLevelCategories,
  fetchProduct,
  fetchProductReviews,
  fetchCategoriesPage,
  fetchCategory,
  fetchTagProducts,
  fetchStoreFilters,
} from "./storefront-server-api";

export {
  submitContactUs,
  submitSubmitOrder,
  submitReview,
  submitReviewReply,
  clientFetchProducts,
} from "./storefront-client-api";
