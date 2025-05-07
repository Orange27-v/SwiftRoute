'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import * as Icons from 'lucide-react'; // Import all icons

type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof Icons; // Use keyof typeof to ensure icon name is valid
  disabled?: boolean;
};

interface DashboardNavProps {
  items: NavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const IconComponent = Icons[item.icon] as React.ElementType; // Assert type
        if (!IconComponent) {
            console.warn(`Icon "${item.icon}" not found in lucide-react. Skipping nav item "${item.label}".`);
            return null; 
        }

        return item.href ? (
          <SidebarMenuItem key={index}>
            <Link href={item.disabled ? '#' : item.href} legacyBehavior passHref>
              <SidebarMenuButton
                isActive={pathname === item.href}
                aria-disabled={item.disabled}
                disabled={item.disabled}
                className={cn(
                  'w-full justify-start',
                  item.disabled && 'cursor-not-allowed opacity-80'
                )}
                tooltip={item.label}
              >
                <IconComponent className="mr-2 h-4 w-4" />
                <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ) : (
          <span
            key={index}
            className="flex w-full cursor-not-allowed items-center rounded-md p-2 opacity-60"
          >
            {item.label}
          </span>
        );
      })}
    </SidebarMenu>
  );
}
