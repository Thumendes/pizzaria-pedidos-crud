import { MenuLink } from "@/components/menu-link";
import { ThemeToggle } from "@/components/providers/root";
import { Pizza } from "lucide-react";
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

          <div className="space-x-3 flex items-center">
            <ThemeToggle />

            <MenuLink href="/orders">Pedidos</MenuLink>
            <MenuLink href="/customers">Clientes</MenuLink>
            <MenuLink href="/menu">Menu</MenuLink>
          </div>
        </div>
      </nav>

      <main className="container max-w-screen-lg">{children}</main>
    </>
  );
}
