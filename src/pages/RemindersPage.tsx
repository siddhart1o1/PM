import { useState } from "react";
import { reminders, Reminder } from "@/data/mockData";
import {
  CalendarClock,
  Bell,
  Plus,
  Clock,
  Calendar,
  AlertTriangle,
  Check,
  Trash,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";

const RemindersPage = () => {
  const [remindersList, setRemindersList] = useState<Reminder[]>(reminders);
  const [newReminder, setNewReminder] = useState<Omit<Reminder, "id">>({
    title: "",
    time: "",
    priority: "medium",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddReminder = () => {
    if (!newReminder.title.trim() || !newReminder.time.trim()) {
      toast.error("Please fill out all fields");
      return;
    }

    const reminder: Reminder = {
      id: `reminder${remindersList.length + 1}`,
      ...newReminder,
    };

    setRemindersList([...remindersList, reminder]);
    setNewReminder({
      title: "",
      time: "",
      priority: "medium",
    });
    setIsDialogOpen(false);
    toast.success("Reminder added successfully");
  };

  const handleDeleteReminder = (id: string) => {
    setRemindersList(remindersList.filter((reminder) => reminder.id !== id));
    toast.success("Reminder deleted");
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          bg: "bg-red-100 dark:bg-red-900/20",
          text: "text-red-700 dark:text-red-400",
          icon: <AlertTriangle className="h-4 w-4 mr-1" />,
        };
      case "medium":
        return {
          bg: "bg-amber-100 dark:bg-amber-900/20",
          text: "text-amber-700 dark:text-amber-400",
          icon: <Clock className="h-4 w-4 mr-1" />,
        };
      case "low":
        return {
          bg: "bg-green-100 dark:bg-green-900/20",
          text: "text-green-700 dark:text-green-400",
          icon: <Check className="h-4 w-4 mr-1" />,
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-700 dark:text-gray-400",
          icon: <Clock className="h-4 w-4 mr-1" />,
        };
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <Bell className="h-6 w-6 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Reminders</h1>
                <p className="text-muted-foreground">
                  Manage your reminders and stay on track
                </p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Reminder</DialogTitle>
                  <DialogDescription>
                    Add a new reminder to your list
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newReminder.title}
                      onChange={(e) =>
                        setNewReminder({
                          ...newReminder,
                          title: e.target.value,
                        })
                      }
                      placeholder="What do you need to remember?"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      value={newReminder.time}
                      onChange={(e) =>
                        setNewReminder({ ...newReminder, time: e.target.value })
                      }
                      placeholder="e.g. Tomorrow, 10:00 AM"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newReminder.priority}
                      onValueChange={(value) =>
                        setNewReminder({
                          ...newReminder,
                          priority: value as "high" | "medium" | "low",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Priority</SelectLabel>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddReminder}>Create Reminder</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {remindersList.map((reminder) => {
              const priorityStyle = getPriorityStyles(reminder.priority);

              return (
                <Card key={reminder.id} className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{reminder.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 opacity-70" />
                      {reminder.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        priorityStyle.bg,
                        priorityStyle.text
                      )}
                    >
                      {priorityStyle.icon}
                      {reminder.priority.charAt(0).toUpperCase() +
                        reminder.priority.slice(1)}{" "}
                      Priority
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteReminder(reminder.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersPage;
