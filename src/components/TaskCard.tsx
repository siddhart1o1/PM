import { useState } from "react";
import { Task } from "@/data/mockData";
import { MessageSquare, Paperclip, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onStatusChange?: (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => void;
}

const TaskCard = ({ task, onDragStart, onStatusChange }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getProgressColor = () => {
    if (task.status === "done") return "bg-green-500";
    if (task.progress / task.totalProgress > 0.6) return "bg-amber-500";
    return "bg-rose-500";
  };

  const formatProgress = () => {
    return `${task.progress}/${task.totalProgress}`;
  };

  return (
    <Card
      className={cn(
        "mb-3 cursor-pointer transition-all duration-200 task-card overflow-hidden border shadow-none relative",
        isHovered ? "ring-1 ring-primary/20" : ""
      )}
      style={{ boxShadow: "none", borderRadius: "6px" }}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-3 pb-2 flex flex-row items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-sm line-clamp-2">{task.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {task.description}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onStatusChange && onStatusChange(task.id, "todo")}
            >
              Move to To Do
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onStatusChange && onStatusChange(task.id, "in-progress")
              }
            >
              Move to In Progress
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange && onStatusChange(task.id, "done")}
            >
              Move to Done
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => toast.success(`Editing task: ${task.title}`)}
            >
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.success(`Deleted task: ${task.title}`)}
              className="text-red-500"
            >
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-3 pt-1 pb-2">
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{formatProgress()}</span>
          </div>
          <Progress
            value={(task.progress / task.totalProgress) * 100}
            className="h-1.5"
            indicatorClassName={getProgressColor()}
          />
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-1 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
          <span>{task.date}</span>
          {task.comments > 0 && (
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{task.comments}</span>
            </div>
          )}
          {task.attachments > 0 && (
            <div className="flex items-center">
              <Paperclip className="h-3 w-3 mr-1" />
              <span>{task.attachments}</span>
            </div>
          )}
        </div>
        <div className="flex -space-x-2">
          {task.assignees.map((user) => (
            <Avatar
              key={user.id}
              className="h-6 w-6 border-2 border-background dark:border-card"
            >
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
