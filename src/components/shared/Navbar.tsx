import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { UserNav } from '@/components/shared/UserNav';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth'; 

export async function Navbar() {
  const user = await getCurrentUser(); 

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          {user ? (
            <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground hidden md:block">
              Dashboard
            </Link>
          ) : (
             <Link href="/register" className="hidden md:block">
                <Button variant="outline" size="sm">Get Started</Button>
            </Link>
          )}
          <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground hidden md:block">
            Features
          </Link>
          {/* <Link href="/#pricing" className="text-muted-foreground transition-colors hover:text-foreground hidden md:block">
            Pricing
          </Link> */}
          <UserNav />
        </nav>
      </div>
    </header>
  );
}
