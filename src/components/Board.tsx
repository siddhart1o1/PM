import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/data/mockData";
import TaskCard from "./TaskCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import "./board.css";

interface BoardProps {
  tasks: Task[];
  onTaskMove?: (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => void;
  onTaskAdd?: (task: Partial<Task>) => void;
}

const Board = ({ tasks, onTaskMove, onTaskAdd }: BoardProps) => {
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    status: "todo",
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
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();

    // Add the drag-over class to the column
    const column = e.currentTarget;
    column.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();

    // Remove the drag-over class from the column
    const column = e.currentTarget;
    column.classList.remove("drag-over");
  };

  const handleDrop = (
    e: React.DragEvent,
    status: "todo" | "in-progress" | "done"
  ) => {
    e.preventDefault();

    // Remove the drag-over class
    const column = e.currentTarget;
    column.classList.remove("drag-over");

    const taskId = e.dataTransfer.getData("taskId");
    onTaskMove && onTaskMove(taskId, status);
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.description) {
      onTaskAdd && onTaskAdd(newTask);
      setNewTask({
        title: "",
        description: "",
        status: "todo",
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
      setIsAddingTask(false);
    } else {
      toast.error("Task title and description are required");
    }
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

  return (
    <div className="flex-1 p-3 md:p-5 overflow-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex gap-3 items-center">
          <h2 className="text-xl font-semibold">Board view</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.success("New view added")}
          >
            Add view
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Dialog
            open={isFilterDialogOpen}
            onOpenChange={setIsFilterDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Tasks</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="filter-todo" className="rounded" />
                  <Label htmlFor="filter-todo">To Do</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="filter-progress"
                    className="rounded"
                  />
                  <Label htmlFor="filter-progress">In Progress</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="filter-done" className="rounded" />
                  <Label htmlFor="filter-done">Done</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsFilterDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Filters applied");
                    setIsFilterDialogOpen(false);
                  }}
                >
                  Apply Filters
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isSortDialogOpen} onOpenChange={setIsSortDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Sort
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sort Tasks</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="sort-date"
                    name="sort"
                    className="rounded"
                  />
                  <Label htmlFor="sort-date">Date (Newest first)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="sort-title"
                    name="sort"
                    className="rounded"
                  />
                  <Label htmlFor="sort-title">Title (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="sort-progress"
                    name="sort"
                    className="rounded"
                  />
                  <Label htmlFor="sort-progress">Progress (High-Low)</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsSortDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Tasks sorted");
                    setIsSortDialogOpen(false);
                  }}
                >
                  Apply Sort
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Additional options menu opened")}
          >
            ...
          </Button>

          <Dialog
            open={isNewTemplateDialogOpen}
            onOpenChange={setIsNewTemplateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm">New template</Button>
            </DialogTrigger>
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
                <div className="grid gap-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    placeholder="Template description (optional)"
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-max">
        {/* To Do Column */}
        <div
          className="task-column bg-background rounded-md overflow-hidden flex flex-col"
          onDragOver={(e) => handleDragOver(e, "todo")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "todo")}
        >
          <div className="flex items-center justify-between mb-3 p-3 border-b">
            <h3 className="font-medium">To Do</h3>
            <span className="text-sm bg-muted px-2 py-1 rounded-full">
              {todoTasks.length}
            </span>
          </div>
          <div className="space-y-3 min-h-[200px] p-3 pt-0 flex-grow">
            {todoTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={handleDragStart}
                onStatusChange={onTaskMove}
              />
            ))}

            {/* Drag area when empty */}
            {todoTasks.length === 0 && (
              <div className="border-2 border-dashed border-gray-200 dark:border-primary/20 rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground h-full">
                <p className="text-sm">Drag your task here...</p>
              </div>
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div
          className="task-column bg-background rounded-md overflow-hidden flex flex-col"
          onDragOver={(e) => handleDragOver(e, "in-progress")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "in-progress")}
        >
          <div className="flex items-center justify-between mb-3 p-3 border-b">
            <h3 className="font-medium">In Progress</h3>
            <span className="text-sm bg-muted px-2 py-1 rounded-full">
              {inProgressTasks.length}
            </span>
          </div>
          <div className="space-y-3 min-h-[200px] p-3 pt-0 flex-grow">
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={handleDragStart}
                onStatusChange={onTaskMove}
              />
            ))}

            {/* Drag area when empty */}
            {inProgressTasks.length === 0 && (
              <div className="border-2 border-dashed border-gray-200 dark:border-primary/20 rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground h-full">
                <p className="text-sm">Drag your task here...</p>
              </div>
            )}
          </div>
        </div>

        {/* Done Column */}
        <div
          className="task-column bg-background rounded-md overflow-hidden flex flex-col"
          onDragOver={(e) => handleDragOver(e, "done")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "done")}
        >
          <div className="flex items-center justify-between mb-3 p-3 border-b">
            <h3 className="font-medium">Done</h3>
            <span className="text-sm bg-muted px-2 py-1 rounded-full">
              {doneTasks.length}
            </span>
          </div>
          <div className="space-y-3 min-h-[200px] p-3 pt-0 flex-grow">
            {doneTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={handleDragStart}
                onStatusChange={onTaskMove}
              />
            ))}

            {/* Drag area when empty */}
            {doneTasks.length === 0 && (
              <div className="border-2 border-dashed border-gray-200 dark:border-primary/20 rounded-md p-6 flex flex-col items-center justify-center text-muted-foreground h-full">
                <p className="text-sm">Drag your task here...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
