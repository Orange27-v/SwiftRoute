import Link from 'next/link';
import { Package2 } from 'lucide-react'; // Using Package2 as a generic logistics icon

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function Logo({ className, iconSize = 6, textSize = "text-xl" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-semibold ${className}`}>
      <Package2 className={`h-${iconSize} w-${iconSize} text-primary`} />
      <span className={`${textSize} text-foreground`}>SwiftRoute</span>
    </Link>
  );
}
