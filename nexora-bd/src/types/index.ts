// Category slugs come from the database, so any string is valid.
export type CategorySlug = string;

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  subcategories: string[];
}

export interface ProductVariants {
  sizes?: string[];
  colors?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  subcategory: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  images: string[];
  variants?: ProductVariants;
  stock: number;
  badges?: string[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  district: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  district: string;
  rating: number;
  quote: string;
}

export interface CartItem {
  lineKey: string;
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export type PaymentMethod = 'cod';

export type DeliveryZoneKey = 'insideDhaka' | 'outsideDhaka';

export interface ShippingDetails {
  fullName: string;
  phone: string;
  address: string;
  district: string;
  area: string;
  zone: DeliveryZoneKey | '';
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  status?: OrderStatus;
  consignmentId?: string;
  trackingCode?: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  shipping: ShippingDetails;
  paymentMethod: PaymentMethod;
}

export type ToastVariant = 'success' | 'info' | 'warning' | 'danger';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}