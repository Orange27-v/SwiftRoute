// src/lib/actions/auth.actions.ts
'use server';

import { login as attemptLogin, logout as attemptLogout } from '@/lib/auth';
import type { User } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export async function handleLogin(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
  const result = await attemptLogin(email, password);
  if (result.success) {
    // Revalidate the entire layout to update Navbar and other auth-dependent components
    revalidatePath('/', 'layout');
    // Optionally redirect here if not handled by client, though client-side redirect is common for forms
    // redirect('/dashboard'); 
  }
  return result;
}

export async function handleLogout(): Promise<void> {
  await attemptLogout();
  // Revalidate the entire layout to update Navbar and other auth-dependent components
  revalidatePath('/', 'layout');
  // Redirect to login page after logout
  redirect('/login');
}