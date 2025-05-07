
import type { User, UserRole } from '@/types';

// This is a mock authentication module.
// In a real application, you would integrate NextAuth.js or a similar library.

// Mock user data - in a real app, this would come from a database after authentication.
const mockUsersDb: Record<string, User> = {
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
    created_at: new Date('2023-01-15T12:00:00Z'),
  },
  'user_logistics_unverified_789': {
    id: 'user_logistics_unverified_789',
    name: 'Pending Logistics Co.',
    email: 'pending@example.com', // Stored in lowercase
    password: 'password_pending_logistics', 
    role: 'logistics',
    is_verified: false,
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
// This helps persist the ID across HMR updates in development
if (globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ === undefined) {
  globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ = null;
  console.log("src/lib/auth.ts: Initialized globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ to null");
} else {
  console.log("src/lib/auth.ts: globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ already exists with value:", globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__);
}

// Simulate getting the current user.
export async function getCurrentUser(): Promise<User | null> {
  const activeUserId = globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__;
  console.log(`getCurrentUser called. globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__: ${activeUserId}`);
  if (!activeUserId) {
    console.log('getCurrentUser: No active user ID on globalThis, returning null.');
    return null;
  }
  const user = mockUsersDb[activeUserId];
  if (!user && activeUserId) { 
    console.warn(`getCurrentUser: User ID ${activeUserId} was set on globalThis but not found in mockUsersDb. Resetting active user.`);
    globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ = null;
    return null;
  }
  if (user) {
    console.log(`getCurrentUser: Returning user ${user.name} for ID ${activeUserId}`);
  } else {
     // This case should ideally not be reached if activeUserId is null checked above,
     // but as a safeguard if activeUserId is truthy but not in mockUsersDb.
    console.log(`getCurrentUser: activeUserId ${activeUserId} is set, but no user found in mockUsersDb. Returning null.`);
  }
  return user || null;
}

// Mock function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

// Mock login function
export async function login(email: string, password: string):Promise<{success: boolean, user?: User, message?: string}> {
  const normalizedEmail = email.toLowerCase();
  const userFound = Object.values(mockUsersDb).find(u => u.email.toLowerCase() === normalizedEmail);

  if (userFound) {
    if (userFound.password === password) {
      globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ = userFound.id;
      console.log(`Mock login: Success! User ${userFound.name} (ID: ${userFound.id}, Email: ${userFound.email}) is now active. globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ set to: ${globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__}`);
      return { success: true, user: userFound };
    } else {
      console.log(`Mock login: Failed for email ${email}. User found, but password incorrect. Provided: '${password}', Expected: '${userFound.password}'. globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ remains: ${globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__}`);
      return { success: false, message: 'Invalid password.' };
    }
  } else {
    console.log(`Mock login: Failed for email ${email}. User not found. globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ remains: ${globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__}`);
    return { success: false, message: 'User not found.' };
  }
}

// Mock logout function
export async function logout(): Promise<void> {
  const currentUserId = globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__;
  globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ = null;
  if (currentUserId) {
    const loggedOutUser = mockUsersDb[currentUserId];
    console.log(`Mock logout: User ${loggedOutUser?.name || currentUserId} has been logged out. globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__ is now null.`);
  } else {
    console.log('Mock logout: No active user to log out on globalThis.');
  }
}

// Initial log to confirm module loading and current state of global variable
console.log("src/lib/auth.ts module logic executed. Current globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__:", globalThis.__MOCKED_ACTIVE_USER_ID_SWIFTROUTE__);
