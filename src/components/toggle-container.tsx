import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
  import { Menu } from "lucide-react";
  import { NavigationRoutes } from "./navigation-routes";
  
  export const ToggleContainer = () => {
    return (
      <Sheet>
        <SheetTrigger className="block md:hidden">
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle />
          </SheetHeader>
  
          <nav className="gap-6 text-4xl m-10 flex flex-col items-start">
            <NavigationRoutes isMobile />
          </nav>
        </SheetContent>
      </Sheet>
    );
  };