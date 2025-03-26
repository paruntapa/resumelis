import { MainRoutes } from "@/lib/nav-helper";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavigationRoutesProps {
  isMobile?: boolean;
}

export const NavigationRoutes = ({
  isMobile = false,
}: NavigationRoutesProps) => {
  return (
    <ul
      className={cn(
        "flex items-center gap-6",
        isMobile && "items-start flex-col gap-8"
      )}
    >
      {MainRoutes.map((route, idx) => (
        <Link
        key={idx}
          href={route.href}
        >
          {route.label}
        </Link>
      ))}
    </ul>
  );
};