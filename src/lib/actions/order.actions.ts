'use server';

import type { DeliveryOrder, CreateDeliveryOrderInput, User, Wallet, PlanId } from '@/types';
import { getCurrentUser, mockUsersDb } from '@/lib/auth'; // Using mock auth
import { revalidatePath } from 'next/cache';
import { PLAN_CONFIG } from '@/config/plans';

// Mock database for delivery orders
let mockOrders: DeliveryOrder[] = [
  {
    id: 'order_1',
    business_id: 'user_business_123', // Specific ID from auth.ts
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
    business_id: 'user_business_123', // Specific ID
    business_name: 'Acme Corp',
    logistics_id: 'user_logistics_456', // Specific ID
    logistics_name: 'Speedy Deliveries',
    logistics_current_plan_at_acceptance: 'pro',
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

// Mock data for wallets
let mockWallets: Wallet[] = [
  {
    id: 'wallet_user_logistics_456', 
    user_id: 'user_logistics_456',
    balance: 1500000, 
    currency: 'NGN',
    created_at: new Date('2023-01-15T12:00:00Z'),
    updated_at: new Date('2024-07-27T10:00:00Z'),
  }
];


export async function createDeliveryOrder(
  data: CreateDeliveryOrderInput
): Promise<{ success: boolean; message: string; order?: DeliveryOrder }> {
  const businessUser = await getCurrentUser();
  if (!businessUser || businessUser.role !== 'business') {
    return { success: false, message: 'Unauthorized: Only businesses can create orders.' };
  }

  if (!data.pickup_address || !data.dropoff_address || !data.item_description || data.price <= 0) {
    return { success: false, message: 'Missing required fields or invalid price.' };
  }

  const newOrder: DeliveryOrder = {
    id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    business_id: businessUser.id,
    business_name: businessUser.name,
    ...data,
    price: Math.round(data.price * 100), 
    status: 'pending_acceptance',
    created_at: new Date(),
    updated_at: new Date(),
  };

  mockOrders.unshift(newOrder); 

  revalidatePath('/dashboard/business/orders');
  revalidatePath('/dashboard/business');
  revalidatePath('/dashboard/logistics'); 
  return { success: true, message: 'Delivery order created successfully!', order: newOrder };
}

export async function getBusinessOrders(): Promise<DeliveryOrder[]> {
  const businessUser = await getCurrentUser();
  if (!businessUser || businessUser.role !== 'business') {
    return [];
  }
  return mockOrders.filter(order => order.business_id === businessUser.id).sort((a,b) => b.created_at.getTime() - a.created_at.getTime());
}

export async function getAvailableOrdersForLogistics(): Promise<DeliveryOrder[]> {
  const logisticsUser = await getCurrentUser();
  if (!logisticsUser || logisticsUser.role !== 'logistics' || !logisticsUser.is_verified) {
    return [];
  }
  return mockOrders.filter(order => order.status === 'pending_acceptance' && !order.logistics_id).sort((a,b) => b.created_at.getTime() - a.created_at.getTime());
}

export async function getLogisticsCompanyDeliveries(): Promise<DeliveryOrder[]> {
  const logisticsUser = await getCurrentUser();
  if (!logisticsUser || logisticsUser.role !== 'logistics') {
    return [];
  }
  return mockOrders.filter(order => order.logistics_id === logisticsUser.id).sort((a,b) => b.updated_at.getTime() - a.updated_at.getTime());
}

export async function acceptDeliveryOrder(
  orderId: string
): Promise<{ success: boolean; message: string; order?: DeliveryOrder }> {
  const logisticsUser = await getCurrentUser();
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
  order.status = 'pending_payment'; 
  order.updated_at = new Date();
  // Store the logistics company's current plan at the time of accepting the order
  // This is important for calculating the correct platform fee later.
  if (logisticsUser.current_plan) {
    order.logistics_current_plan_at_acceptance = logisticsUser.current_plan;
  } else {
     // Default to basic if for some reason the user has no plan (shouldn't happen in a real scenario)
    order.logistics_current_plan_at_acceptance = 'basic';
  }
  mockOrders[orderIndex] = order;

  revalidatePath('/dashboard/logistics');
  revalidatePath('/dashboard/logistics/my-deliveries');
  revalidatePath(`/dashboard/business/orders`); 
  return { success: true, message: 'Order accepted. Awaiting payment from business.', order };
}


export async function updateOrderStatus(
  orderId: string,
  newStatus: DeliveryOrder['status']
): Promise<{ success: boolean; message: string; order?: DeliveryOrder }> {
  const user = await getCurrentUser(); 
  if (!user) {
    return { success: false, message: 'Unauthorized.' };
  }

  const orderIndex = mockOrders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    return { success: false, message: 'Order not found.' };
  }
  
  const order = mockOrders[orderIndex];
  
  let canUpdate = false;

  if (newStatus === 'delivered' && user.role === 'logistics' && order.logistics_id === user.id && order.status === 'in_escrow') {
     canUpdate = true;
  } 
  else if (newStatus === 'confirmed_by_business' && user.role === 'business' && order.business_id === user.id && order.status === 'delivered') {
    canUpdate = true;
    const logisticsWallet = await getLogisticsWallet(order.logistics_id);
    
    if (logisticsWallet && order.logistics_id && order.logistics_current_plan_at_acceptance) {
        const planId = order.logistics_current_plan_at_acceptance;
        // Use the plan details from PLAN_CONFIG. Fallback to basic if plan somehow doesn't exist (defensive)
        const planDetails = PLAN_CONFIG[planId] || PLAN_CONFIG.basic;
        const platformFeePercentage = planDetails.fee_percentage;
        
        const platformFee = Math.round(order.price * (platformFeePercentage / 100));
        const amountToLogistics = order.price - platformFee;
        
        logisticsWallet.balance += amountToLogistics;
        logisticsWallet.updated_at = new Date();
        
        const walletIndex = mockWallets.findIndex(w => w.user_id === order.logistics_id);
        if(walletIndex !== -1) {
          mockWallets[walletIndex] = logisticsWallet;
        } else {
          mockWallets.push(logisticsWallet); 
        }
        console.log(`Order ${order.id}: Business confirmed. Price: ${order.price}. Logistics Plan: ${planId}. Fee %: ${platformFeePercentage}. Platform Fee: ${platformFee}. Amount to Logistics: ${amountToLogistics}.`);
    } else if (logisticsWallet && order.logistics_id) {
        console.warn(`Order ${order.id}: Logistics plan at acceptance missing. Releasing full amount for now, or apply default high fee.`);
        // For now, release full amount as a fallback. In production, this might be an error or apply a default (higher) fee.
        logisticsWallet.balance += order.price; 
        logisticsWallet.updated_at = new Date();
        const walletIndex = mockWallets.findIndex(w => w.user_id === order.logistics_id);
        if(walletIndex !== -1) mockWallets[walletIndex] = logisticsWallet; else mockWallets.push(logisticsWallet);
    }

  } else if (newStatus === 'cancelled_by_business' && user.role === 'business' && order.business_id === user.id && (order.status === 'pending_acceptance' || order.status === 'pending_payment')) {
    canUpdate = true;
    order.logistics_id = null; 
    order.logistics_name = null;
    order.logistics_current_plan_at_acceptance = null;
  } else if (newStatus === 'cancelled_by_logistics' && user.role === 'logistics' && order.logistics_id === user.id && order.status === 'pending_payment') { 
    canUpdate = true;
    order.status = 'pending_acceptance'; 
    order.logistics_id = null;
    order.logistics_name = null;
    order.logistics_current_plan_at_acceptance = null;
    order.updated_at = new Date();
    mockOrders[orderIndex] = order;
    revalidatePath('/dashboard/business/orders');
    revalidatePath('/dashboard/logistics');
    revalidatePath('/dashboard/logistics/my-deliveries');
    return { success: true, message: `Order cancelled by logistics and returned to pool.`, order };
  }
  // Mock transition to 'in_escrow' - In a real app, this would be triggered by Paystack webhook after successful payment
  // For now, we allow business to manually trigger this if they are the one who should pay.
  else if (newStatus === 'in_escrow' && user.role === 'business' && order.business_id === user.id && order.status === 'pending_payment') {
     canUpdate = true;
     // Here you would ideally verify payment with Paystack if it was a real payment flow
     console.log(`Order ${order.id} manually moved to 'in_escrow' by business (mock payment).`);
  }


  if (!canUpdate) {
    return { success: false, message: `Cannot update order to ${newStatus} from ${order.status} with your role.`};
  }

  order.status = newStatus;
  order.updated_at = new Date();
  mockOrders[orderIndex] = order;

  revalidatePath('/dashboard/business/orders');
  revalidatePath('/dashboard/business');
  revalidatePath('/dashboard/logistics');
  revalidatePath('/dashboard/logistics/my-deliveries');
  revalidatePath('/dashboard/logistics/earnings');
  return { success: true, message: `Order status updated to ${newStatus}.`, order };
}


export async function getLogisticsWallet(userIdFromOrder?: string | null): Promise<Wallet | null> {
  const currentLoggedInUser = await getCurrentUser();
  const targetUserId = userIdFromOrder || (currentLoggedInUser?.role === 'logistics' ? currentLoggedInUser.id : null);

  if (!targetUserId) {
    return null;
  }

  let wallet = mockWallets.find(wallet => wallet.user_id === targetUserId);
  
  const targetUserDetails = mockUsersDb[targetUserId]; 
  if (!wallet && targetUserDetails && targetUserDetails.role === 'logistics') {
    const newWallet: Wallet = {
      id: `wallet_${targetUserId}`,
      user_id: targetUserId,
      balance: 0,
      currency: 'NGN', 
      created_at: new Date(),
      updated_at: new Date(),
    };
    mockWallets.push(newWallet);
    console.log(`Created new wallet for logistics user ${targetUserId}`);
    return newWallet;
  }
  
  return wallet || null;
}
