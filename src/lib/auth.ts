import type { User, UserRole } from '@/types';

// This is a mock authentication module.
// In a real application, you would integrate NextAuth.js or a similar library.

// Mock user data - in a real app, this would come from a database after authentication.
const mockUsers: Record<string, User> = {
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
  'user_admin_789': {
    id: 'user_admin_789',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    is_verified: true,
    created_at: new Date('2023-01-01T08:00:00Z'),
  },
};

// Simulate getting the current user.
// In a real app, this would involve checking session cookies or tokens.
export async function getCurrentUser(simulatedRole?: UserRole): Promise<User | null> {
  // For demonstration, we'll allow simulating a role or default to business user.
  // In a real app, you'd derive this from the actual session.
  if (simulatedRole === 'logistics') {
    return mockUsers['user_logistics_456'];
  }
  if (simulatedRole === 'admin') {
    return mockUsers['user_admin_789'];
  }
  if (simulatedRole === 'business') {
    return mockUsers['user_business_123'];
  }
  
  // Default to business user if no specific role is requested for simulation,
  // or return null if you want to simulate a logged-out state.
  // For this example, let's assume a business user is logged in by default for development.
  return mockUsers['user_business_123']; 
  // return null; // To simulate logged out state
}

// Mock function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

// Mock login function
export async function login(email: string, password: string):Promise<{success: boolean, user?: User, message?: string}> {
  // Basic mock logic
  if (email === 'business@example.com' && password === 'password') {
    return { success: true, user: mockUsers['user_business_123'] };
  }
  if (email === 'logistics@example.com' && password === 'password') {
     return { success: true, user: mockUsers['user_logistics_456'] };
  }
  return { success: false, message: 'Invalid credentials' };
}

// Mock logout function
export async function logout(): Promise<void> {
  // In a real app, this would clear session cookies/tokens.
  console.log('User logged out (mock)');
}
