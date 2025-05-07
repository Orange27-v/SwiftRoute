'use server';

import type { DeliveryOrder, CreateDeliveryOrderInput, User } from '@/types';
import { getCurrentUser } from '@/lib/auth'; // Using mock auth
import { revalidatePath } from 'next/cache';

// Mock database for delivery orders
let mockOrders: DeliveryOrder[] = [
  {
    id: 'order_1',
    business_id: 'user_business_123',
    business_name: 'Acme Corp',
    pickup_address: '123 Main St, Anytown, USA',
    pickup_lat: 34.0522,
    pickup_lng: -118.2437,
    dropoff_address: '456 Oak Ave, Otherville, USA',
    dropoff_lat: 34.0530,
    dropoff_lng: -118.2440,
    item_description: 'Box of widgets',
    price: 5000, // in kobo/cents
    status: 'pending_acceptance',
    created_at: new Date('2024-07-27T10:00:00Z'),
    updated_at: new Date('2024-07-27T10:00:00Z'),
  },
  {
    id: 'order_2',
    business_id: 'user_business_123',
    business_name: 'Acme Corp',
    logistics_id: 'user_logistics_456',
    logistics_name: 'Speedy Deliveries',
    pickup_address: '789 Pine Ln, Anytown, USA',
    dropoff_address: '101 Maple Rd, Otherville, USA',
    item_description: 'Important documents',
    price: 2500,
    status: 'in_escrow',
    created_at: new Date('2024-07-26T14:30:00Z'),
    updated_at: new Date('2024-07-26T15:00:00Z'),
  },
  {
    id: 'order_3',
    business_id: 'another_business_789',
    business_name: 'Beta Innovations',
    pickup_address: '222 Innovation Dr, Tech City, USA',
    dropoff_address: '333 Enterprise Ave, Metroburg, USA',
    item_description: 'Fragile electronics prototype',
    price: 12000,
    status: 'pending_acceptance',
    created_at: new Date('2024-07-28T09:15:00Z'),
    updated_at: new Date('2024-07-28T09:15:00Z'),
  },
];

export async function createDeliveryOrder(
  data: CreateDeliveryOrderInput
): Promise<{ success: boolean; message: string; order?: DeliveryOrder }> {
  const businessUser = await getCurrentUser('business'); // Ensure it's a business user
  if (!businessUser || businessUser.role !== 'business') {
    return { success: false, message: 'Unauthorized: Only businesses can create orders.' };
  }

  // Basic validation (in a real app, use Zod or similar)
  if (!data.pickup_address || !data.dropoff_address || !data.item_description || data.price <= 0) {
    return { success: false, message: 'Missing required fields or invalid price.' };
  }

  const newOrder: DeliveryOrder = {
    id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    business_id: businessUser.id,
    business_name: businessUser.name,
    ...data,
    price: Math.round(data.price * 100), // Store in kobo/cents
    status: 'pending_acceptance',
    created_at: new Date(),
    updated_at: new Date(),
  };

  mockOrders.unshift(newOrder); // Add to the beginning of the array

  revalidatePath('/dashboard/business/orders');
  revalidatePath('/dashboard/logistics'); // So logistics providers see new orders
  return { success: true, message: 'Delivery order created successfully!', order: newOrder };
}

export async function getBusinessOrders(): Promise<DeliveryOrder[]> {
  const businessUser = await getCurrentUser('business');
  if (!businessUser || businessUser.role !== 'business') {
    return [];
  }
  return mockOrders.filter(order => order.business_id === businessUser.id);
}

export async function getAvailableOrdersForLogistics(): Promise<DeliveryOrder[]> {
  // Simulate a logistics user. In a real app, this would be based on session.
  const logisticsUser = await getCurrentUser('logistics');
  if (!logisticsUser || logisticsUser.role !== 'logistics' || !logisticsUser.is_verified) {
    // Only verified logistics companies can see orders
    return [];
  }
  // Return orders that are pending acceptance and not yet assigned to any logistics company
  return mockOrders.filter(order => order.status === 'pending_acceptance' && !order.logistics_id);
}

export async function getLogisticsCompanyDeliveries(): Promise<DeliveryOrder[]> {
  const logisticsUser = await getCurrentUser('logistics');
  if (!logisticsUser || logisticsUser.role !== 'logistics') {
    return [];
  }
  return mockOrders.filter(order => order.logistics_id === logisticsUser.id);
}

export async function acceptDeliveryOrder(
  orderId: string
): Promise<{ success: boolean; message: string; order?: DeliveryOrder }> {
  const logisticsUser = await getCurrentUser('logistics');
  if (!logisticsUser || logisticsUser.role !== 'logistics' || !logisticsUser.is_verified) {
    return { success: false, message: 'Unauthorized or not verified.' };
  }

  const orderIndex = mockOrders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    return { success: false, message: 'Order not found.' };
  }

  const order = mockOrders[orderIndex];
  if (order.status !== 'pending_acceptance' || order.logistics_id) {
    return { success: false, message: 'Order is not available for acceptance.' };
  }

  order.logistics_id = logisticsUser.id;
  order.logistics_name = logisticsUser.name;
  order.status = 'pending_payment'; // Next step: business pays into escrow
  order.updated_at = new Date();
  mockOrders[orderIndex] = order;

  revalidatePath('/dashboard/logistics');
  revalidatePath(`/dashboard/business/orders`); // Notify business
  return { success: true, message: 'Order accepted. Awaiting payment from business.', order };
}


export async function updateOrderStatus(
  orderId: string,
  newStatus: DeliveryOrder['status']
): Promise<{ success: boolean; message: string; order?: DeliveryOrder }> {
  const user = await getCurrentUser(); // Could be business or logistics
  if (!user) {
    return { success: false, message: 'Unauthorized.' };
  }

  const orderIndex = mockOrders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    return { success: false, message: 'Order not found.' };
  }
  
  const order = mockOrders[orderIndex];

  // Add logic here to check if the user is authorized to change to this status
  // e.g., only logistics can mark as 'delivered', only business can 'confirm_by_business'
  
  // Example: Logistics marks as delivered
  if (newStatus === 'delivered' && user.role === 'logistics' && order.logistics_id === user.id) {
     if (order.status !== 'in_escrow') {
      return { success: false, message: 'Order cannot be marked delivered from current status.' };
    }
  } 
  // Example: Business confirms delivery
  else if (newStatus === 'confirmed_by_business' && user.role === 'business' && order.business_id === user.id) {
    if (order.status !== 'delivered') {
      return { success: false, message: 'Order must be marked delivered first.' };
    }
    // Here, you would trigger payment release from escrow
  } 
  // Add other status transition checks and role permissions

  order.status = newStatus;
  order.updated_at = new Date();
  mockOrders[orderIndex] = order;

  revalidatePath('/dashboard/business/orders');
  revalidatePath('/dashboard/logistics');
  revalidatePath('/dashboard/logistics/my-deliveries');
  return { success: true, message: `Order status updated to ${newStatus}.`, order };
}


// Mock data for wallets
let mockWallets: Wallet[] = [
  {
    id: 'wallet_logistics_456',
    user_id: 'user_logistics_456',
    balance: 1500000, // e.g. 15,000 NGN in kobo
    currency: 'NGN',
    created_at: new Date('2023-01-15T12:00:00Z'),
    updated_at: new Date('2024-07-27T10:00:00Z'),
  }
];

export async function getLogisticsWallet(): Promise<Wallet | null> {
  const logisticsUser = await getCurrentUser('logistics');
  if (!logisticsUser || logisticsUser.role !== 'logistics') {
    return null;
  }
  return mockWallets.find(wallet => wallet.user_id === logisticsUser.id) || null;
}
