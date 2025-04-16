import { useState } from "react";
import {
  Bell,
  Calendar,
  Search,
  Filter,
  SlidersHorizontal,
  User,
  AlertTriangle,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { users } from "@/data/mockData";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface HeaderProps {
  currentUser?: (typeof users)[0];
  currentDate?: string;
  onSidebarToggle?: () => void;
  sidebarCollapsed?: boolean;
  className?: string;
}

const Header = ({
  currentUser = users[0],
  currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  onSidebarToggle,
  sidebarCollapsed = true,
  className,
}: HeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSearch = (query: string) => {
    toast.info(`Searching for: ${query}`);
    // In a real app, this would trigger a search
  };

  const handleFilter = (filter: string) => {
    toast.info(`Filter applied: ${filter}`);
    setFilterOpen(false);
    // In a real app, this would apply filters
  };

  return (
    <header
      className={cn(
        "bg-background border-b border-border py-3 px-4 md:px-6 flex items-center justify-between gap-3 z-10",
        className
      )}
    >
      {/* Left side: Menu toggle and welcome message for desktop */}
      <div className="flex items-center">
        {isMobile && onSidebarToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={onSidebarToggle}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        <h1 className="hidden md:block text-lg font-semibold">
          Welcome back, {currentUser.name}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 md:space-x-3 ml-auto">
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 md:h-9 md:w-9"
            >
              <Search className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Search</DialogTitle>
              <DialogDescription>
                Search through your tasks and projects
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Type to search..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </DialogContent>
        </Dialog>

        <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 md:h-9 md:w-9"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleFilter("all")}>
              All Tasks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("active")}>
              Active Tasks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("completed")}>
              Completed Tasks
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 md:h-9 md:w-9"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 md:w-80">
            <div className="p-2">
              <h4 className="font-medium text-sm mb-1">Notifications</h4>
              <p className="text-xs text-muted-foreground mb-2">
                You have 3 unread notifications
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 rounded-md hover:bg-muted cursor-pointer">
                  <div className="rounded-full bg-blue-100 p-1">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Meeting reminder</p>
                    <p className="text-xs text-muted-foreground">
                      Team standup in 30 minutes
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:h-9 md:w-9"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 md:w-80">
            <div className="p-2">
              <h4 className="font-medium text-sm mb-1">Team Members</h4>
              <p className="text-xs text-muted-foreground mb-2">
                View team member profiles
              </p>
              <div className="space-y-2">
                {users.map((user) => (
                  <Link
                    key={user.id}
                    to={`/users/${user.id}`}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.id === currentUser.id ? "You" : "Team Member"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer h-8 w-8 md:h-9 md:w-9">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info("Logged out successfully")}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
