import type { User, UserRole } from '@/types';

// This is a mock authentication module.
// In a real application, you would integrate NextAuth.js or a similar library.

// Mock user data - in a real app, this would come from a database after authentication.
const mockUsersDb: Record<string, User> = {
  'user_business_123': {
    id: 'user_business_123',
    name: 'Acme Corp',
    email: 'business@example.com',
    role: 'business',
    is_verified: true,
    created_at: new Date('2023-01-01T10:00:00Z'),
  },
  'user_logistics_456': {
    id: 'user_logistics_456',
    name: 'Speedy Deliveries',
    email: 'logistics@example.com',
    role: 'logistics',
    is_verified: true,
    created_at: new Date('2023-01-15T12:00:00Z'),
  },
  'user_logistics_unverified_789': {
    id: 'user_logistics_unverified_789',
    name: 'Pending Logistics Co.',
    email: 'pending@example.com',
    role: 'logistics',
    is_verified: false,
    created_at: new Date('2023-02-01T10:00:00Z'),
  },
  'user_admin_789': {
    id: 'user_admin_789',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    is_verified: true,
    created_at: new Date('2023-01-01T08:00:00Z'),
  },
};

// To simulate different users, MANUALLY CHANGE THE VALUE of MOCKED_ACTIVE_USER_ID below and refresh your browser.
// Examples:
// let MOCKED_ACTIVE_USER_ID: string | null = 'user_business_123';        // Business User
// let MOCKED_ACTIVE_USER_ID: string | null = 'user_logistics_456';         // Verified Logistics User
// let MOCKED_ACTIVE_USER_ID: string | null = 'user_logistics_unverified_789'; // Unverified Logistics User
// let MOCKED_ACTIVE_USER_ID: string | null = 'user_admin_789';             // Admin User
// let MOCKED_ACTIVE_USER_ID: string | null = null;                         // Logged Out

let MOCKED_ACTIVE_USER_ID: string | null = 'user_business_123'; // Default to business user

// Simulate getting the current user.
// In a real app, this would involve checking session cookies or tokens.
export async function getCurrentUser(): Promise<User | null> {
  if (!MOCKED_ACTIVE_USER_ID) {
    return null;
  }
  return mockUsersDb[MOCKED_ACTIVE_USER_ID] || null;
}

// Mock function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

// Mock login function
// NOTE: In this simplified mock, login/logout don't persistently change MOCKED_ACTIVE_USER_ID
// for subsequent server component renders without a proper session mechanism (e.g., cookies).
// For testing different roles, manually change MOCKED_ACTIVE_USER_ID at the top of this file.
export async function login(email: string, password: string):Promise<{success: boolean, user?: User, message?: string}> {
  const userFound = Object.values(mockUsersDb).find(u => u.email === email);

  if (userFound && password === 'password') { // Simplified password check
    // To make login "stick" for testing, you could update MOCKED_ACTIVE_USER_ID here,
    // but it would require a client-side way to trigger re-render or a cookie mechanism.
    // For now, this function primarily serves the UI login form.
    // MOCKED_ACTIVE_USER_ID = userFound.id; // This line would "log in" the user for subsequent calls in the same request flow if it were client-side.
    return { success: true, user: userFound };
  }
  return { success: false, message: 'Invalid credentials' };
}

// Mock logout function
export async function logout(): Promise<void> {
  // MOCKED_ACTIVE_USER_ID = null; // This won't "stick" for server components without further mechanism.
  console.log('User logged out (mock). Manual change of MOCKED_ACTIVE_USER_ID needed for testing logged out state.');
  // In a real app, this would clear session cookies/tokens and likely redirect.
}
