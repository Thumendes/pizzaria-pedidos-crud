"use client";

import TrpcProvider from "@/lib/trpc/Provider";
import { ThemeProvider, useTheme } from "next-themes";
import { ReactNode } from "react";
import { AlertDialogComponent } from "../alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { Toaster } from "../ui/sonner";

interface ProvidersProps {
  children: ReactNode;
  cookies: string;
}

export function Providers({ cookies, children }: ProvidersProps) {
  return (
    <TrpcProvider cookies={cookies}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AlertDialogComponent />
        <Toaster richColors />

        {children}
      </ThemeProvider>
    </TrpcProvider>
  );
}

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Escuro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>Auto</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
