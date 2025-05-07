import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  switch (user.role) {
    case 'business':
      redirect('/dashboard/business');
      break;
    case 'logistics':
      redirect('/dashboard/logistics');
      break;
    case 'admin':
      redirect('/dashboard/admin');
      break;
    default:
      // Fallback, though should not happen if roles are well-defined
      redirect('/login'); 
  }

  return null; // Or a loading spinner if preferred
}
