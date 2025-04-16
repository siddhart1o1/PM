import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { projects, tasks } from "@/data/mockData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  ListFilter,
  SortDesc,
  Search,
  ChevronRight,
  Tag,
  Users,
  Clock,
  Filter,
  CalendarRange,
  Construction,
  Calendar,
  Tags,
  CheckCircle2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProjectsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState("all");

  // Get current project or default to "all"
  const currentProject = projects.find((p) => p.id === id) || projects[0];

  // Filter tasks based on the current project
  let projectTasks =
    id === "all" ? tasks : tasks.filter((task) => task.project === id);

  // Apply search filtering
  if (searchTerm) {
    projectTasks = projectTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply status filtering
  if (statusFilter !== "all") {
    projectTasks = projectTasks.filter((task) => task.status === statusFilter);
  }

  // Sort tasks
  if (sortBy === "newest") {
    projectTasks.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } else if (sortBy === "oldest") {
    projectTasks.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } else if (sortBy === "status") {
    const statusOrder = { "in-progress": 0, todo: 1, done: 2 };
    projectTasks.sort((a, b) => {
      return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
    });
  }

  // Calculate completion percentages
  const calculateProgress = (projectId: string) => {
    const projectSpecificTasks = tasks.filter(
      (task) => task.project === projectId
    );
    if (projectSpecificTasks.length === 0) return 0;

    const completedTasks = projectSpecificTasks.filter(
      (task) => task.status === "done"
    );
    return Math.round(
      (completedTasks.length / projectSpecificTasks.length) * 100
    );
  };

  const handleNewProject = () => {
    toast.info("Creating new project");
    // This would open the new project modal
  };

  const handleSort = (value: string) => {
    setSortBy(value);
    toast.success(`Sorted by ${value}`);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    toast.success(`Filtered by status: ${value}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Searching for: ${searchTerm}`);
  };

  useEffect(() => {
    if (id === "tickets") {
      setView("list");
    }
  }, [id]);

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {id === "tickets" ? "Project Tickets" : currentProject.name}
            </h1>
            {id !== "all" && id !== "tickets" && (
              <p className="text-muted-foreground mt-1">
                {currentProject.description || "Project description goes here"}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <form onSubmit={handleSearch} className="flex-1 md:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tasks..."
                  className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-accent" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setView(view === "grid" ? "list" : "grid")}
              >
                <ListFilter className="h-4 w-4" />
              </Button>

              <Button onClick={handleNewProject}>
                <Plus className="h-4 w-4 mr-2" />
                {isMobile ? "" : "New"}
              </Button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-card border rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {id !== "all" && (
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={handleStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSortBy("newest");
                  setStatusFilter("all");
                  toast.success("Filters reset");
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        )}

        {id === "tickets" ? (
          <TicketsView />
        ) : id === "all" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects
              .filter((p) => p.id !== "all")
              .map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span>{project.name}</span>
                        <Badge
                          variant={getProjectStatusVariant(
                            calculateProgress(project.id)
                          )}
                        >
                          {getProjectStatus(calculateProgress(project.id))}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.description ||
                          "Project description would go here"}
                      </p>

                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{calculateProgress(project.id)}%</span>
                        </div>
                        <Progress
                          value={calculateProgress(project.id)}
                          className="h-2"
                        />
                      </div>

                      <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Tag className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {
                              tasks.filter((t) => t.project === project.id)
                                .length
                            }{" "}
                            Tasks
                          </span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {
                              tasks.filter(
                                (t) =>
                                  t.project === project.id &&
                                  t.status === "done"
                              ).length
                            }{" "}
                            Completed
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between items-center">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Updated {project.lastUpdated || "recently"}</span>
                      </div>
                      <div className="flex">
                        <Badge variant="outline" className="text-xs">
                          {project.category || "General"}
                        </Badge>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
          </div>
        ) : (
          <div>
            <Tabs defaultValue="tasks" className="w-full mb-6">
              <TabsList>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks" className="pt-4">
                {projectTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No tasks found matching your filters
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                ) : view === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="hover:shadow-md transition-shadow h-full"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {task.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            {task.description}
                          </p>

                          <div className="flex flex-wrap gap-1 my-3">
                            <Badge variant={getStatusVariant(task.status)}>
                              {formatStatus(task.status)}
                            </Badge>
                          </div>

                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>
                                {task.progress}/{task.totalProgress}
                              </span>
                            </div>
                            <Progress
                              value={(task.progress / task.totalProgress) * 100}
                              className="h-2"
                              indicatorClassName={
                                task.status === "done"
                                  ? "bg-green-500"
                                  : task.progress / task.totalProgress > 0.6
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }
                            />
                          </div>

                          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{task.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/task/${task.id}`}
                                className="text-foreground hover:underline"
                              >
                                View details
                              </Link>
                              <div className="flex -space-x-2">
                                {task.assignees.map((assignee) => (
                                  <Link
                                    key={assignee.id}
                                    to={`/users/${assignee.id}`}
                                  >
                                    <Avatar className="h-6 w-6 border-2 border-background">
                                      <AvatarImage
                                        src={assignee.avatar}
                                        alt={assignee.name}
                                      />
                                      <AvatarFallback>
                                        {assignee.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 p-4 text-sm font-medium">
                      <div className="col-span-5">Task</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-1">Priority</div>
                      <div className="col-span-2">Due Date</div>
                      <div className="col-span-2">Assignee</div>
                    </div>
                    <div className="divide-y">
                      {projectTasks.map((task) => (
                        <div
                          key={task.id}
                          className="grid grid-cols-12 p-4 text-sm items-center hover:bg-muted/50 cursor-pointer"
                          onClick={() =>
                            toast.info(`Opening task: ${task.title}`)
                          }
                        >
                          <div className="col-span-5">
                            <div className="font-medium">{task.title}</div>
                            <div className="text-muted-foreground text-xs mt-1 line-clamp-1">
                              {task.description}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <Badge variant={getStatusVariant(task.status)}>
                              {formatStatus(task.status)}
                            </Badge>
                          </div>
                          <div className="col-span-1">
                            {task.priority ? (
                              <Badge
                                variant={getPriorityVariant(task.priority)}
                              >
                                {task.priority}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                          <div className="col-span-2">{task.date}</div>
                          <div className="col-span-2">
                            {task.assignee || "Unassigned"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="p-4">
                <div className="text-center py-12">
                  <CalendarRange className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Project Timeline</h3>
                  <p className="text-muted-foreground mb-4">
                    View your project timeline and milestones
                  </p>
                  <Button
                    onClick={() => toast.info("Timeline feature clicked")}
                  >
                    View Timeline
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="files" className="p-4">
                <div className="text-center py-12">
                  <Construction className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Project Files</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload and manage files related to this project
                  </p>
                  <Button onClick={() => toast.info("Upload files clicked")}>
                    Upload Files
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="team" className="p-4">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Project Team</h3>
                  <p className="text-muted-foreground mb-4">
                    Manage team members and permissions
                  </p>
                  <Button onClick={() => toast.info("Add team member clicked")}>
                    Add Team Member
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for Tickets view
const TicketsView = () => {
  const ticketsMock = [
    {
      id: "t1",
      title: "Login page not responsive on mobile",
      status: "open",
      priority: "high",
      category: "bug",
      assignee: "Alex Johnson",
      date: "2024-04-10",
    },
    {
      id: "t2",
      title: "Update documentation for API v2",
      status: "in-progress",
      priority: "medium",
      category: "task",
      assignee: "Sarah Miller",
      date: "2024-04-12",
    },
    {
      id: "t3",
      title: "Add dark mode toggle",
      status: "closed",
      priority: "low",
      category: "feature",
      assignee: "Michael Chen",
      date: "2024-04-05",
    },
    {
      id: "t4",
      title: "Performance issues on dashboard",
      status: "open",
      priority: "critical",
      category: "bug",
      assignee: "Emma Wilson",
      date: "2024-04-15",
    },
    {
      id: "t5",
      title: "Add export to CSV feature",
      status: "in-progress",
      priority: "medium",
      category: "feature",
      assignee: "James Rodriguez",
      date: "2024-04-11",
    },
  ];

  const [activeTab, setActiveTab] = useState("all");

  const getTickets = () => {
    if (activeTab === "all") return ticketsMock;
    return ticketsMock.filter((ticket) =>
      activeTab === "open"
        ? ticket.status === "open"
        : activeTab === "in-progress"
        ? ticket.status === "in-progress"
        : ticket.status === "closed"
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500";
      case "in-progress":
        return "bg-amber-500";
      case "closed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-rose-500 text-white";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "bug":
        return "border-red-200 bg-red-50 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300";
      case "feature":
        return "border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300";
      case "task":
        return "border-green-200 bg-green-50 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300";
      default:
        return "border-gray-200 bg-gray-50 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              All Tickets
              <Badge variant="secondary" className="ml-2">
                {ticketsMock.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="open">
              Open
              <Badge variant="secondary" className="ml-2">
                {ticketsMock.filter((t) => t.status === "open").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress
              <Badge variant="secondary" className="ml-2">
                {ticketsMock.filter((t) => t.status === "in-progress").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="closed">
              Closed
              <Badge variant="secondary" className="ml-2">
                {ticketsMock.filter((t) => t.status === "closed").length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="bg-muted/40 grid grid-cols-12 p-4 text-sm font-medium">
          <div className="col-span-5 md:col-span-4">Ticket</div>
          <div className="col-span-2 md:col-span-2">Status</div>
          <div className="col-span-2 md:col-span-1">Priority</div>
          <div className="hidden md:block md:col-span-2">Category</div>
          <div className="col-span-3 md:col-span-3">Assignee / Date</div>
        </div>
        <div className="divide-y">
          {getTickets().map((ticket) => (
            <div
              key={ticket.id}
              className="grid grid-cols-12 p-4 text-sm items-center hover:bg-muted/50 cursor-pointer"
              onClick={() => toast.info(`Opening ticket: ${ticket.title}`)}
            >
              <div className="col-span-5 md:col-span-4">
                <div className="font-medium">{ticket.title}</div>
                <div className="text-muted-foreground text-xs mt-1">
                  #{ticket.id}
                </div>
              </div>
              <div className="col-span-2 md:col-span-2">
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(
                      ticket.status
                    )}`}
                  ></div>
                  <span className="capitalize">
                    {ticket.status.replace("-", " ")}
                  </span>
                </div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <Badge className={`${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </Badge>
              </div>
              <div className="hidden md:block md:col-span-2">
                <Badge
                  variant="outline"
                  className={`${getCategoryStyle(ticket.category)}`}
                >
                  {ticket.category}
                </Badge>
              </div>
              <div className="col-span-3 md:col-span-3">
                <div className="font-medium">{ticket.assignee}</div>
                <div className="text-muted-foreground text-xs mt-1">
                  {ticket.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper functions for status and styling
const formatStatus = (status: string) => {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "done":
      return "default";
    case "in-progress":
      return "secondary";
    case "todo":
      return "outline";
    default:
      return "outline";
  }
};

const getPriorityVariant = (
  priority: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "outline";
  }
};

const getProjectStatus = (progress: number): string => {
  if (progress === 100) return "Completed";
  if (progress > 75) return "Near Complete";
  if (progress > 25) return "In Progress";
  return "Just Started";
};

const getProjectStatusVariant = (
  progress: number
): "default" | "secondary" | "destructive" | "outline" => {
  if (progress === 100) return "default";
  if (progress > 75) return "secondary";
  if (progress > 25) return "secondary";
  return "outline";
};

export default ProjectsPage;
