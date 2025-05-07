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

// MOCKED_ACTIVE_USER_ID determines the currently "logged-in" user.
// It defaults to null (logged out). Login/logout functions will modify this.
// For initial testing of a specific logged-in state on app load, you can temporarily set this ID here.
// e.g., let MOCKED_ACTIVE_USER_ID: string | null = 'user_business_123';
let MOCKED_ACTIVE_USER_ID: string | null = null; 

// Simulate getting the current user.
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
export async function login(email: string, password: string):Promise<{success: boolean, user?: User, message?: string}> {
  const userFound = Object.values(mockUsersDb).find(u => u.email === email);

  if (userFound && password === 'password') { // Simplified password check
    MOCKED_ACTIVE_USER_ID = userFound.id; // Set the active user ID
    console.log(`Mock login: User ${userFound.name} (${userFound.id}) is now active.`);
    return { success: true, user: userFound };
  }
  console.log(`Mock login: Failed for email ${email}.`);
  return { success: false, message: 'Invalid credentials' };
}

// Mock logout function
export async function logout(): Promise<void> {
  console.log(`Mock logout: User ${MOCKED_ACTIVE_USER_ID} is being logged out.`);
  MOCKED_ACTIVE_USER_ID = null; // Clear the active user ID
  console.log('Mock logout: MOCKED_ACTIVE_USER_ID is now null.');
}