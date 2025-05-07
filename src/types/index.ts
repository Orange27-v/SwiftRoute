export type UserRole = 'business' | 'logistics' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_verified: boolean;
  created_at: Date;
  // Potentially add walletId if users can have general wallets
}

export type DeliveryOrderStatus = 
  | 'pending_acceptance' // New order, awaiting logistics company
  | 'pending_payment' // Accepted by logistics, business needs to pay
  | 'in_escrow' // Payment made, delivery in progress
  | 'delivered' // Logistics marked as delivered
  | 'confirmed_by_business' // Business confirmed delivery, payment released
  | 'cancelled_by_business'
  | 'cancelled_by_logistics'
  | 'disputed';

export interface DeliveryOrder {
  id: string;
  business_id: string;
  business_name?: string; // For display
  logistics_id?: string | null;
  logistics_name?: string | null; // For display
  pickup_address: string;
  pickup_lat?: number | null;
  pickup_lng?: number | null;
  dropoff_address: string;
  dropoff_lat?: number | null;
  dropoff_lng?: number | null;
  item_description: string;
  price: number; // in smallest currency unit (e.g., kobo, cents)
  status: DeliveryOrderStatus;
  created_at: Date;
  updated_at: Date;
  // Additional fields like estimated delivery time, package size/weight etc.
}

export type PaymentStatus = 
  | 'pending' 
  | 'processing_escrow'
  | 'in_escrow' 
  | 'releasing_to_logistics'
  | 'released_to_logistics' 
  | 'refunded_to_business'
  | 'failed';

export interface Payment {
  id: string;
  order_id: string;
  amount: number; // in smallest currency unit
  status: PaymentStatus;
  paystack_reference?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Wallet {
  id: string; // Could be user_id if one wallet per user
  user_id: string; // Links to the User
  balance: number; // in smallest currency unit
  currency: string; // e.g., 'NGN', 'USD'
  created_at: Date;
  updated_at: Date;
}

// For forms, typically subset of main types
export type CreateDeliveryOrderInput = Omit<DeliveryOrder, 'id' | 'business_id' | 'business_name' | 'logistics_id' | 'logistics_name' | 'status' | 'created_at' | 'updated_at'> & {
  // Any specific form fields if different
};
