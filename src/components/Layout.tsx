import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import Sidebar from "./Sidebar";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme} mode`);
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar
        toggleTheme={toggleTheme}
        currentTheme={theme}
        onToggle={handleSidebarToggle}
        defaultCollapsed={isCollapsed}
      />
      <main className="flex-1 flex flex-col overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
