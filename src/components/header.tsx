"use client"
import { cn } from "@/lib/utils";
import { NavigationRoutes } from "./navigation-routes";
import { ToggleContainer } from "./toggle-container";
import { ProfileContainer } from "./profile-container";
import { LogoContainer } from "./logo-container";
import { Container } from "./Container";

const Header = () => {
  return (
    <header
      className={cn("w-full border-b duration-150 transition-all ease-in-out")}
    >
      <Container>
        <div className="flex items-center gap-4 w-full">
          {/* logo section */}
          <LogoContainer />

          {/* navigation section */}
          <nav className="hidden md:flex items-center gap-3">
            <NavigationRoutes />
          </nav>

          <div className="ml-auto flex items-center gap-6">
            {/* profile section */}
            <ProfileContainer />

            {/* mobile toggle section */}
            <ToggleContainer />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
