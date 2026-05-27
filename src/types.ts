export type CategoryType = 'burgers' | 'sides' | 'drinks' | 'desserts';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  image: string;
  ingredients: string[];
  isPopular?: boolean;
  preparationTime: number; // in minutes
}

export interface CartItem {
  id: string; // Dynamic ID representing product_id + hash of custom options
  product: Product;
  quantity: number;
  notes: string;
  customizations: {
    noOnion?: boolean;
    extraCheese?: boolean;
    extraSauce?: boolean;
  };
}

export type OrderStatus = 'received' | 'preparing' | 'delivery' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: {
    fullName: string;
    phone: string;
    street: string;
    number: string;
    neighborhood: string;
    referenceNotes?: string;
  };
  paymentMethod: 'card' | 'pix' | 'cash';
  paymentDetails?: {
    cashChange?: string;
  };
  status: OrderStatus;
  createdAt: string;
}
