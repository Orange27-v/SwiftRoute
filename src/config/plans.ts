import type { PlanId } from '@/types';

interface PlanDetails {
  name: string;
  fee_percentage: number;
  description: string;
  features: string[];
}

export const PLAN_CONFIG: Record<PlanId, PlanDetails> = {
  basic: {
    name: "Basic",
    fee_percentage: 5.0,
    description: "Ideal for new logistics partners or individual couriers.",
    features: [
      "Handle up to 10 client orders/month",
      "Basic support",
      "Escrow-secured payments",
      "Delivery tracking tools"
    ],
  },
  pro: {
    name: "Pro",
    fee_percentage: 3.5,
    description: "For established delivery companies aiming to expand.",
    features: [
      "Handle up to 100 client orders/month",
      "Priority support",
      "Escrow-secured payments",
      "Advanced delivery analytics"
    ],
  },
  enterprise: {
    name: "Enterprise",
    fee_percentage: 2.0, // Example custom fee
    description: "Custom solutions for large-scale logistics operations.",
    features: [
      "Handle unlimited client orders",
      "Dedicated account management",
      "Custom platform fees",
      "Customizable API access"
    ],
  },
} as const;
