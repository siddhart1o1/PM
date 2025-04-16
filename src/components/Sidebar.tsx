import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  projects,
  taskCategories,
  reminders,
  messengers,
  Reminder,
  Messenger,
} from "@/data/mockData";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Users,
  CalendarDays,
  BarChart,
  FolderKanban,
  MessageSquare,
  Bell,
  SunMoon,
  Moon,
  Sun,
  PlusCircle,
  LayoutDashboard,
  User,
  Search,
  Filter,
  Settings,
  Clock,
  Mail,
  Ticket,
  ListTodo,
  Tag,
  ChevronRightSquare,
  ChevronRightCircle,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  toggleTheme: () => void;
  currentTheme: string;
  onToggle?: (collapsed: boolean) => void;
  defaultCollapsed?: boolean;
}

const Sidebar = ({
  toggleTheme,
  currentTheme,
  onToggle,
  defaultCollapsed = false,
}: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [remindersExpanded, setRemindersExpanded] = useState(false);
  const [messengersExpanded, setMessengersExpanded] = useState(false);
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (onToggle) {
      onToggle(isCollapsed);
    }
  }, [isCollapsed, onToggle]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNewTemplate = () => {
    if (newTemplateName.trim()) {
      toast.success(`Created new template: ${newTemplateName}`);
      setNewTemplateName("");
      setIsNewTemplateDialogOpen(false);
    } else {
      toast.error("Template name cannot be empty");
    }
  };

  const handleReminderClick = (reminder: Reminder) => {
    toast.info(`Opening reminder: ${reminder.title}`);
  };

  const handleMessengerClick = (messenger: Messenger) => {
    toast.info(`Opening messenger: ${messenger.name}`);
  };

  // Mobile menu toggle button for when sidebar is collapsed
  const MobileSidebarToggle = () => {
    if (!isMobile || !isCollapsed) return null;

    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    );
  };

  return (
    <>
      <MobileSidebarToggle />

      <aside
        className={cn(
          "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
          isCollapsed ? "w-16" : "w-72",
          isMobile
            ? "fixed inset-y-0 left-0 shadow-lg z-50"
            : "sticky top-0 z-30"
        )}
        style={{
          transform: isMobile && isCollapsed ? "translateX(-100%)" : "none",
          willChange: "transform, width",
        }}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-sidebar-foreground truncate ml-1">
              Projects
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              isCollapsed ? "ml-auto" : "",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className={cn("py-2", isCollapsed ? "px-2" : "px-4")}>
            {!isCollapsed && (
              <>
                <div className="mb-4">
                  <div
                    className="flex items-center mb-2 cursor-pointer text-sidebar-foreground"
                    onClick={() => setProjectsExpanded(!projectsExpanded)}
                  >
                    {projectsExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1" />
                    )}
                    <span className="font-semibold">Projects</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-5 w-5 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsNewTemplateDialogOpen(true);
                      }}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>

                  {projectsExpanded && (
                    <div className="ml-5 space-y-1">
                      {projects.map((project) => (
                        <Link
                          key={project.id}
                          to={`/projects/${project.id}`}
                          className={cn(
                            "flex items-center justify-between py-1 px-2 rounded-md text-sm",
                            location.pathname === `/projects/${project.id}`
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                          )}
                        >
                          <span>{project.name}</span>
                          {project.count && (
                            <span className="text-xs text-sidebar-foreground opacity-70">
                              ({project.count})
                            </span>
                          )}
                        </Link>
                      ))}
                      <Link
                        to="/projects/tickets"
                        className={cn(
                          "flex items-center justify-between py-1 px-2 rounded-md text-sm",
                          location.pathname === `/projects/tickets`
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        <span>Tickets</span>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div
                    className="flex items-center mb-2 cursor-pointer text-sidebar-foreground"
                    onClick={() => setTasksExpanded(!tasksExpanded)}
                  >
                    {tasksExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1" />
                    )}
                    <span className="font-semibold">Tasks</span>
                  </div>

                  {tasksExpanded && (
                    <div className="ml-5 space-y-1">
                      {taskCategories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/tasks/${category.id}`}
                          className={cn(
                            "flex items-center justify-between py-1 px-2 rounded-md text-sm",
                            location.pathname === `/tasks/${category.id}`
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                          )}
                        >
                          <span>{category.name}</span>
                          {category.count && (
                            <span className="text-xs text-sidebar-foreground opacity-70">
                              ({category.count})
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div
                    className="flex items-center mb-2 cursor-pointer text-sidebar-foreground"
                    onClick={() => setRemindersExpanded(!remindersExpanded)}
                  >
                    {remindersExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1" />
                    )}
                    <span className="font-semibold">Reminders</span>
                    <Badge variant="default" className="ml-auto text-xs">
                      3
                    </Badge>
                  </div>

                  {remindersExpanded && (
                    <div className="ml-5 space-y-2">
                      <Link to="/reminders" className="block">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-2"
                        >
                          <ChevronRightCircle className="h-4 w-4 mr-2" />
                          Manage Reminders
                        </Button>
                      </Link>
                      {reminders.map((reminder) => (
                        <button
                          key={reminder.id}
                          onClick={() => handleReminderClick(reminder)}
                          className="flex items-start w-full py-1 px-2 rounded-md text-sm text-left text-sidebar-foreground hover:bg-sidebar-accent/50"
                        >
                          <Clock className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{reminder.title}</p>
                            <p className="text-xs opacity-70">
                              {reminder.time}
                            </p>
                          </div>
                          {reminder.priority === "high" && (
                            <Badge
                              variant="destructive"
                              className="ml-auto text-[10px] h-4"
                            >
                              High
                            </Badge>
                          )}
                          {reminder.priority === "medium" && (
                            <Badge
                              variant="outline"
                              className="ml-auto text-[10px] h-4"
                            >
                              Medium
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div
                    className="flex items-center mb-2 cursor-pointer text-sidebar-foreground"
                    onClick={() => setMessengersExpanded(!messengersExpanded)}
                  >
                    {messengersExpanded ? (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1" />
                    )}
                    <span className="font-semibold">Messengers</span>
                    <Badge variant="default" className="ml-auto text-xs">
                      19
                    </Badge>
                  </div>

                  {messengersExpanded && (
                    <div className="ml-5 space-y-1">
                      <Link to="/messengers" className="block">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-2"
                        >
                          <ChevronRightCircle className="h-4 w-4 mr-2" />
                          Manage Messengers
                        </Button>
                      </Link>
                      {messengers.map((messenger) => (
                        <button
                          key={messenger.id}
                          onClick={() => handleMessengerClick(messenger)}
                          className="flex items-center justify-between w-full py-1 px-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50"
                        >
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>{messenger.name}</span>
                          </div>
                          {messenger.unread > 0 && (
                            <Badge
                              variant="default"
                              className="bg-primary text-xs"
                            >
                              {messenger.unread}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/board"
                  className={cn(
                    "flex items-center py-1 px-2 rounded-md text-sm mb-2",
                    location.pathname === "/board"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  <span>Board</span>
                </Link>

                <Link
                  to="/settings"
                  className={cn(
                    "flex items-center py-1 px-2 rounded-md text-sm mb-2",
                    location.pathname === "/settings"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-auto border-t border-sidebar-border p-4">
          {!isCollapsed ? (
            <div className="w-full flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={() => {
                  toast.info("Help documentation opened");
                  setHelpDialogOpen(true);
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Help
              </Button>
              <div className="flex space-x-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative"
                    >
                      <Bell className="h-4 w-4" />
                      <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="p-2 text-xs">
                      <h4 className="font-medium mb-1">Notifications</h4>
                      <p className="text-muted-foreground mb-2">
                        You have 3 unread notifications
                      </p>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  onClick={toggleTheme}
                >
                  {currentTheme === "light" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={toggleTheme}
              >
                {currentTheme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay to close sidebar when clicking outside */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <Dialog
        open={isNewTemplateDialogOpen}
        onOpenChange={setIsNewTemplateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Enter template name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewTemplateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleNewTemplate}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Help Center</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Learn how to create projects, manage tasks, and collaborate with
                your team.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => toast.info("Getting started guide opened")}
              >
                View guide →
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Keyboard Shortcuts</h3>
              <p className="text-sm text-muted-foreground">
                Boost your productivity with these keyboard shortcuts.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => toast.info("Keyboard shortcuts opened")}
              >
                View shortcuts →
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Contact Support</h3>
              <p className="text-sm text-muted-foreground">
                Need help with something specific? Our support team is here to
                help.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => toast.info("Support contact opened")}
              >
                Contact support →
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHelpDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;
