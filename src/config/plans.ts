import type { PlanId } from '@/types';

interface PlanDetails {
  name: string;
  fee_percentage: number;
  priceMonthly?: number; // Optional, as enterprise is custom
  description: string;
  features: string[];
}

export const PLAN_CONFIG: Record<PlanId, PlanDetails> = {
  basic: { 
    name: "Basic", 
    fee_percentage: 5.0, 
    priceMonthly: 0,
    description: "Ideal for new logistics partners or individual couriers.", 
    features: ["Handle up to 10 client orders/month", "Basic support", "Platform fee on deliveries: 5%"] 
  },
  pro: { 
    name: "Pro", 
    fee_percentage: 3.5, 
    priceMonthly: 49,
    description: "For established delivery companies aiming to expand.", 
    features: ["Handle up to 100 client orders/month", "Priority support", "Platform fee on deliveries: 3.5%"] 
  },
  enterprise: { 
    name: "Enterprise", 
    fee_percentage: 2.0, // Example custom fee
    description: "Custom solutions for large-scale logistics operations.", 
    features: ["Handle unlimited client orders", "Dedicated account management", "Custom platform fees"] 
  }
} as const;
