
import type { User, UserRole, PlanId } from '@/types';

// This is a mock authentication module.
// In a real application, you would integrate NextAuth.js or a similar library.

// Mock user data - in a real app, this would come from a database after authentication.
export const mockUsersDb: Record<string, User> = {
  'user_business_123': {
    id: 'user_business_123',
    name: 'Acme Corp',
    email: 'business@example.com', // Stored in lowercase
    password: 'password_business', 
    role: 'business',
    is_verified: true,
    created_at: new Date('2023-01-01T10:00:00Z'),
  },
  'user_logistics_456': {
    id: 'user_logistics_456',
    name: 'Speedy Deliveries',
    email: 'logistics@example.com', // Stored in lowercase
    password: 'password_logistics', 
    role: 'logistics',
    is_verified: true,
    current_plan: 'pro', // Logistics company's subscription plan
    created_at: new Date('2023-01-15T12:00:00Z'),
  },
  'user_logistics_unverified_789': {
    id: 'user_logistics_unverified_789',
    name: 'Pending Logistics Co.',
    email: 'pending@example.com', // Stored in lowercase
    password: 'password_pending_logistics', 
    role: 'logistics',
    is_verified: false,
    current_plan: 'basic', // Default plan
    created_at: new Date('2023-02-01T10:00:00Z'),
  },
  'user_admin_789': {
    id: 'user_admin_789',
    name: 'Admin User',
    email: 'admin@example.com', // Stored in lowercase
    password: 'password_admin', 
    role: 'admin',
    is_verified: true,
    created_at: new Date('2023-01-01T08:00:00Z'),
  },
};

// Ensure the global variable is declared for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var __MOCKED_ACTIVE_USER_ID_SWIFTROUTE__: string | null | undefined;
}

// Initialize MOCKED_ACTIVE_USER_ID on globalThis if not already set
if (globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ === undefined) {
  globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ = null;
}


// Simulate getting the current user.
export async function getCurrentUser(): Promise<User | null> {
  const activeUserId = globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__;
  if (!activeUserId) {
    return null;
  }
  const user = mockUsersDb[activeUserId];
  if (!user && activeUserId) { 
    globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ = null;
    return null;
  }
  return user || null;
}

// Mock login function
export async function login(email: string, password: string):Promise<{success: boolean, user?: User, message?: string}> {
  const normalizedEmail = email.toLowerCase();
  const userFound = Object.values(mockUsersDb).find(u => u.email.toLowerCase() === normalizedEmail);

  if (userFound) {
    if (userFound.password === password) {
      globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ = userFound.id;
      return { success: true, user: userFound };
    } else {
      return { success: false, message: 'Invalid password.' };
    }
  } else {
    return { success: false, message: 'User not found.' };
  }
}

// Mock logout function
export async function logout(): Promise<void> {
  globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ = null;
}
