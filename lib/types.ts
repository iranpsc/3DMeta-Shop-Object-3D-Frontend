export type ProductImage = {
  id: number;
  path: string;
  url: string;
};

export type CategorySummary = {
  id: number;
  name: string;
  slug: string;
  url: string;
  description?: string | null;
  products_count?: number;
  image?: ProductImage | null;
  parent?: {
    id: number;
    name: string;
    slug: string;
    url: string;
  } | null;
  children?: Array<{
    id: number;
    name: string;
    slug: string;
    url: string;
    image?: ProductImage | null;
  }>;
  products?: {
    data: ProductCard[];
    meta: PaginationMeta;
  } | [];
};

export type TagSummary = {
  id: number;
  name: string;
  slug: string;
  url: string;
};

export type ProductCard = {
  id: number;
  sku: string;
  name: string;
  slug: string;
  url: string;
  price: number;
  sale_price: number;
  final_price: number;
  discount: number;
  is_free: boolean;
  rating_avg?: number | null;
  reviews_count?: number;
  image?: ProductImage | null;
  category?: CategorySummary | null;
};

export type ProductDetail = ProductCard & {
  short_description?: string | null;
  long_description?: string | null;
  stock_status?: boolean;
  quantity?: number;
  customer_can_add_review?: boolean;
  approved_reviews_count?: number;
  likes_count?: number;
  user_liked?: boolean;
  user_bookmarked?: boolean;
  user_can_download?: boolean;
  images?: ProductImage[];
  files?: Array<{
    id: number;
    name?: string | null;
    extension?: string | null;
    size?: string | number | null;
    url?: string | null;
  }>;
  tags?: TagSummary[];
  attributes?: Array<{
    id: number;
    name: string;
    slug?: string | null;
    value: string | null;
  }>;
  similar_products?: ProductCard[];
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ReviewItem = {
  id: number;
  comment: string;
  rating: number;
  created_at: string;
  user?: { id: number; name: string; avatar?: string | null } | null;
  replies?: Array<{
    id: number;
    comment: string;
    created_at: string;
    user?: { id: number; name: string; avatar?: string | null } | null;
  }>;
};

export type CartItem = {
  product_id: number;
  quantity: number;
};

export type CartSnapshot = {
  items: CartItem[];
  products: ProductCard[];
  count: number;
  total_price: number;
};

export type CheckoutStep = "create-account" | "payment";

export type CheckoutState = CartSnapshot & {
  step: CheckoutStep;
};

export type VerifyPaymentResult = {
  success: boolean;
  status: number;
  reference_id?: string | null;
  tracking_id?: string | number | null;
  order_id?: string | null;
  products?: Array<{
    id: number;
    sku: string;
    name: string;
    url: string;
    files: Array<{ id: number; name: string; url: string }>;
  }>;
};

export type DashboardStats = {
  orders_total: number;
  orders_paid: number;
  orders_unpaid: number;
  products_owned: number;
  tickets_open: number;
};

export type DashboardSummary = {
  stats: DashboardStats;
  recent_orders: OrderSummary[];
};

export type OrderSummary = {
  id: string;
  tracking_id: string | number;
  amount: number;
  total_price?: number | null;
  status: number;
  is_paid: boolean;
  status_label: string;
  product_names?: string[];
  product_skus?: string[];
  created_at?: string | null;
};

export type OrderDetail = {
  id: string;
  tracking_id: string | number;
  amount: number;
  status: number;
  is_paid: boolean;
  status_label: string;
  created_at?: string | null;
  products: Array<{
    id: number;
    sku: string;
    name: string;
    quantity: number;
    download_count: number;
    downloaded_at?: string | null;
    files: Array<{ id: number; name: string; url: string }>;
  }>;
};

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  email_verified_at: string | null;
};

export type AvatarItem = {
  id: number;
  name: string;
  sku: string;
  slug: string;
  image?: { id: number; url: string } | null;
  files?: Array<{ id: number; name: string; url: string }>;
  created_at?: string | null;
};

export type TicketItem = {
  id: number;
  title: string;
  message: string;
  priority: string;
  priority_label: string;
  status: string;
  status_label: string;
  response_status: string;
  response_status_label: string;
  attachment?: string | null;
  attachment_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  user?: { id: number; name: string; email: string; avatar?: string | null };
  responses?: Array<{
    id: number;
    message: string;
    attachment?: string | null;
    created_at?: string | null;
    user?: { id: number; name: string; avatar?: string | null };
  }>;
};

export type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type PaginatedEnvelope<T> = {
  data: T;
  message?: string | null;
  info?: string | null;
  meta?: PaginationMeta;
  links?: Record<string, string | null>;
};

export type AdminDashboardStats = {
  products_count: number;
  orders_total: number;
  orders_paid: number;
  total_sales: number;
  users_count: number;
};

export type AdminProduct = ProductDetail & {
  published?: boolean;
  meta_description?: string;
  meta_keywords?: string;
  delivery_time?: number | string | null;
  created_at?: string | null;
  category_id?: number;
};

export type AdminProductFormData = {
  categories: CategorySummary[];
  tags: TagSummary[];
  attributes: Array<{ id: number; name: string; slug: string }>;
  next_sku: string;
};

export type ChunkUploadedFile = {
  path: string;
  name: string;
  mime_type: string;
  size: string;
};

export type AdminReview = {
  id: number;
  comment: string;
  rating: number;
  approved: boolean;
  approved_at?: string | null;
  approved_by?: string | null;
  created_at?: string | null;
  user?: { id: number; name: string } | null;
  product?: { id: number; name: string; sku: string } | null;
  replies_count?: number;
  replies?: AdminReviewReply[];
};

export type AdminReviewReply = {
  id: number;
  comment: string;
  approved: boolean;
  approved_at?: string | null;
  approved_by?: string | null;
  created_at?: string | null;
  user?: { id: number; name: string; avatar?: string | null } | null;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  products_count?: number;
  created_at?: string | null;
};

export type AdminSubmitOrder = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  attachment?: string | null;
  attachment_url?: string | null;
  created_at?: string | null;
};

export type AdminContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at?: string | null;
};

export type AdminAttribute = {
  id: number;
  name: string;
  slug: string;
  created_at?: string | null;
};
