import { ThemeToggle } from "@/components/providers/root";
import { Pizza } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className="py-5">
        <div className="container max-w-screen-lg flex items-center justify-between">
          <div>
            <h3 className="">
              <Pizza />
            </h3>
          </div>

          <div className="space-x-4 flex items-center">
            <ThemeToggle />
            <Link href="/menu">Menu</Link>
            <Link href="/orders">Pedidos</Link>
            <Link href="/customers">Clientes</Link>
          </div>
        </div>
      </nav>

      <main className="container max-w-screen-lg">{children}</main>
    </>
  );
}
