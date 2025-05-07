const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;
const BASE_URL = "https://api.paystack.co";

if (!PAYSTACK_SECRET_KEY) {
  console.warn('PAYSTACK_SECRET_KEY is not set. Paystack integration will not work.');
}
if (!PAYSTACK_PUBLIC_KEY) {
  console.warn('PAYSTACK_PUBLIC_KEY is not set. Some Paystack features might not work as expected.');
}

interface InitializeTransactionData {
  email: string;
  amount: string; // Amount in kobo or cents
  currency?: string; // e.g. NGN, USD. Defaults to NGN if not provided by Paystack.
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  // Add other fields as per Paystack documentation
}

interface InitializeTransactionResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
  // Add other fields from Paystack's response
}

export async function initializeTransaction(data: InitializeTransactionData): Promise<InitializeTransactionResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    return { status: false, message: "Paystack secret key not configured." };
  }

  try {
    const res = await fetch(`${BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Paystack API Error:", errorData);
      return { status: false, message: errorData.message || "Failed to initialize transaction with Paystack" };
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error initializing Paystack transaction:", error);
    return { status: false, message: "An unexpected error occurred while initializing transaction." };
  }
}

interface VerifyTransactionResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    status: string; // e.g. "success", "failed", "abandoned"
    reference: string;
    amount: number; // Amount in kobo or cents
    currency: string;
    customer: {
      email: string;
    };
    metadata?: Record<string, any>;
    // Add other fields from Paystack's verification response
  };
}

export async function verifyTransaction(reference: string): Promise<VerifyTransactionResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    return { status: false, message: "Paystack secret key not configured." };
  }

  try {
    const res = await fetch(`${BASE_URL}/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Paystack API Verification Error:", errorData);
      return { status: false, message: errorData.message || "Failed to verify transaction with Paystack" };
    }

    return await res.json();
  } catch (error) {
    console.error("Error verifying Paystack transaction:", error);
    return { status: false, message: "An unexpected error occurred while verifying transaction." };
  }
}

// TODO: Add more functions as needed, e.g., for managing subaccounts (for escrow), refunds, etc.
// For escrow, you might need to:
// 1. Collect funds (standard initialize/verify).
// 2. Hold funds (conceptually, Paystack holds it until you trigger a transfer).
// 3. Transfer funds to a logistics company's bank account or subaccount. Paystack's "Transfers" or "Split Payments" might be relevant.
//    This usually involves creating recipients (logistics companies with their bank details) on Paystack.

export const paystack = {
  initializeTransaction,
  verifyTransaction,
  // getBanks, createTransferRecipient, initiateTransfer, etc.
};
