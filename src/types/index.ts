// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyResetCodeData {
  resetCode: string;
}

export interface ResetPasswordData {
  email: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export interface UpdateUserData {
  name: string;
  email: string;
  phone: string;
}

// Product Types
export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  sold: number;
  price: number;
  priceAfterDiscount?: number;
  availableColors?: string[];
  imageCover: string;
  images: string[];
  category: Category;
  subcategory: Subcategory[];
  brand: Brand;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  results: number;
  metadata: Metadata;
  data: Product[];
}

export interface ProductResponse {
  data: Product;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesResponse {
  results: number;
  metadata: Metadata;
  data: Category[];
}

export interface CategoryResponse {
  data: Category;
}

// Subcategory Types
export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubcategoriesResponse {
  results: number;
  metadata: Metadata;
  data: Subcategory[];
}

// Brand Types
export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandsResponse {
  results: number;
  metadata: Metadata;
  data: Brand[];
}

export interface BrandResponse {
  data: Brand;
}

// Cart Types
export interface CartItem {
  count: number;
  _id: string;
  product: Product;
  price: number;
}

export interface Cart {
  _id: string;
  cartOwner: string;
  products: CartItem[];
  totalCartPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  status: string;
  numOfCartItems: number;
  cartId?: string;
  data: Cart;
}

export interface AddToCartResponse {
  status: string;
  message: string;
  numOfCartItems: number;
  cartId: string;
  data: Cart;
}

// Wishlist Types
export interface WishlistResponse {
  status: string;
  count: number;
  data: Product[];
}

export interface AddToWishlistResponse {
  status: string;
  message: string;
  data: string[];
}

// Address Types
export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddressesResponse {
  status: string;
  data: Address[];
}

export interface AddAddressData {
  name: string;
  details: string;
  phone: string;
  city: string;
}

// Order Types
export interface OrderItem {
  count: number;
  _id: string;
  product: Product;
  price: number;
}

export interface Order {
  _id: string;
  user: User;
  cartItems: OrderItem[];
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: "cash" | "card";
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  shippingAddress?: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  results: number;
  metadata: Metadata;
  data: Order[];
}

export interface CreateOrderData {
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
}

export interface CheckoutSessionResponse {
  status: string;
  session: {
    url: string;
  };
}

// Metadata
export interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}

// API Error
export interface ApiError {
  message: string;
  statusMsg?: string;
  errors?: Record<string, string[]>;
}
