import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import {
  Task,
  tasks as initialTasks,
  taskCategories,
  User,
} from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus, ListFilter, SortDesc, Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const TasksPage = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "title" | "progress" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status:
      id === "todo"
        ? "todo"
        : id === "progress"
        ? "in-progress"
        : id === "done"
        ? "done"
        : "todo",
    progress: 0,
    totalProgress: 10,
    date: new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    comments: 0,
    attachments: 0,
    assignees: [],
  });
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);

  // Get current task category or default to "all"
  const currentCategory =
    taskCategories.find((c) => c.id === (id || "all")) || taskCategories[0];

  // Apply filters and search
  let filteredTasks = tasks;

  // Filter by category first
  if (id !== "all" && id) {
    const categoryMap: Record<string, string> = {
      todo: "todo",
      progress: "in-progress",
      done: "done",
    };
    const statusToFilter = categoryMap[id] || id;
    filteredTasks = tasks.filter((task) => task.status === statusToFilter);
  }

  // Apply status filters if any
  if (filterStatus.length > 0) {
    filteredTasks = filteredTasks.filter((task) =>
      filterStatus.includes(task.status)
    );
  }

  // Apply search
  if (searchTerm) {
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply sorting
  if (sortBy) {
    filteredTasks = [...filteredTasks].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === "progress") {
        const aProgress = a.progress / a.totalProgress;
        const bProgress = b.progress / b.totalProgress;
        comparison = aProgress - bProgress;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }

  const handleStatusChange = (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Show toast notification
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      toast.success(
        `Task "${task.title}" moved to ${newStatus.replace("-", " ")}`
      );
    }
  };

  const toggleSort = (column: "date" | "title" | "progress") => {
    if (sortBy === column) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    toast.success(
      `Sorted by ${column} in ${
        sortOrder === "asc" ? "ascending" : "descending"
      } order`
    );
  };

  const toggleFilter = (status: string) => {
    setFilterStatus((prev) => {
      if (prev.includes(status)) {
        const result = prev.filter((s) => s !== status);
        toast.success(`Removed "${status}" filter`);
        return result;
      } else {
        toast.success(`Added "${status}" filter`);
        return [...prev, status];
      }
    });
  };

  const clearFilters = () => {
    setFilterStatus([]);
    toast.success("All filters cleared");
  };

  const handleNewTask = () => {
    if (newTask.title && newTask.description) {
      const taskId = `task-${Math.floor(Math.random() * 10000)}`;
      const newTaskComplete = {
        ...newTask,
        id: taskId,
        assignees: [{ id: "user-1", name: "John Doe", avatar: "" }],
        comments: 0,
        attachments: 0,
      } as Task;

      setTasks((prev) => [newTaskComplete, ...prev]);
      setNewTask({
        title: "",
        description: "",
        status:
          id === "todo"
            ? "todo"
            : id === "progress"
            ? "in-progress"
            : id === "done"
            ? "done"
            : "todo",
        progress: 0,
        totalProgress: 10,
        date: new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        comments: 0,
        attachments: 0,
        assignees: [],
      });
      setIsNewTaskDialogOpen(false);
      toast.success(`New task created: ${newTask.title}`);
    } else {
      toast.error("Title and description are required");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{currentCategory.name}</h1>

          <div className="flex gap-2">
            {isSearchVisible ? (
              <div className="flex items-center bg-background border border-input rounded-md">
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchTerm("");
                    setIsSearchVisible(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSearchVisible(true)}
              >
                <Search className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline md:inline">Search</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListFilter className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline md:inline">
                    Filter
                  </span>{" "}
                  {filterStatus.length > 0 && `(${filterStatus.length})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={filterStatus.includes("todo")}
                  onCheckedChange={() => toggleFilter("todo")}
                >
                  To Do
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatus.includes("in-progress")}
                  onCheckedChange={() => toggleFilter("in-progress")}
                >
                  In Progress
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatus.includes("done")}
                  onCheckedChange={() => toggleFilter("done")}
                >
                  Done
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters}>
                  Clear All Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SortDesc className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline md:inline">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleSort("date")}>
                  {sortBy === "date"
                    ? `Date (${
                        sortOrder === "asc" ? "Oldest first" : "Newest first"
                      })`
                    : "Sort by Date"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort("title")}>
                  {sortBy === "title"
                    ? `Title (${sortOrder === "asc" ? "A to Z" : "Z to A"})`
                    : "Sort by Title"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort("progress")}>
                  {sortBy === "progress"
                    ? `Progress (${
                        sortOrder === "asc" ? "Low to High" : "High to Low"
                      })`
                    : "Sort by Progress"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
              open={isNewTaskDialogOpen}
              onOpenChange={setIsNewTaskDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline md:inline">New Task</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-title">Title</Label>
                    <Input
                      id="task-title"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      placeholder="Task title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                      placeholder="Task description"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-status">Status</Label>
                    <select
                      id="task-status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newTask.status}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          status: e.target.value as
                            | "todo"
                            | "in-progress"
                            | "done",
                        })
                      }
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsNewTaskDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleNewTask}>Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-card rounded-md shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assigned to</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <Link
                        to={`/task/${task.id}`}
                        className="font-medium hover:underline"
                      >
                        {task.title}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        {task.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          task.status === "todo"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : ""
                        }
                        ${
                          task.status === "in-progress"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : ""
                        }
                        ${
                          task.status === "done"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : ""
                        }
                      `}
                      >
                        {task.status === "todo"
                          ? "To Do"
                          : task.status === "in-progress"
                          ? "In Progress"
                          : "Done"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
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
                    </TableCell>
                    <TableCell>{task.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {task.assignees.map((assignee) => (
                          <Link key={assignee.id} to={`/users/${assignee.id}`}>
                            <Avatar className="h-8 w-8">
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
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(task.id, "todo")}
                          >
                            Move to To Do
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(task.id, "in-progress")
                            }
                          >
                            Move to In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(task.id, "done")}
                          >
                            Move to Done
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              toast.success(`Editing task: ${task.title}`)
                            }
                          >
                            Edit Task
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setTasks(tasks.filter((t) => t.id !== task.id));
                              toast.success(`Task "${task.title}" deleted`);
                            }}
                          >
                            Delete Task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchTerm ? (
                      <div>
                        <p>No tasks found matching "{searchTerm}"</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setSearchTerm("")}
                        >
                          Clear Search
                        </Button>
                      </div>
                    ) : filterStatus.length > 0 ? (
                      <div>
                        <p>No tasks found with selected filters</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={clearFilters}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p>No tasks available</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setIsNewTaskDialogOpen(true)}
                        >
                          Create New Task
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
