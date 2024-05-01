"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface MenuLinkProps {
  href: string;
  children: ReactNode;
}

export function MenuLink({ href, children }: MenuLinkProps) {
  const path = usePathname();
  const isActive = path === href;

  return (
    <Link href={href}>
      <div
        className={cn(
          "p-1 px-2 text-sm rounded-md text-muted-foreground hover:text-foreground",
          isActive && "text-foreground bg-muted"
        )}
      >
        {children}
      </div>
    </Link>
  );
}
