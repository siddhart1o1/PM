import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import {
  tasks,
  users,
  User,
  Task,
  activityLogs,
  ActivityLogItem,
  comments,
  Comment,
} from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Edit,
  Link as LinkIcon,
  Trash,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const TaskDetailsPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [currentUser] = useState(users[0]); // Logged in user for header
  const [task, setTask] = useState<Task | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([]);
  const [taskComments, setTaskComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Find the task
    const foundTask = tasks.find((t) => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);

      // Get activity log for this task
      const taskActivities = activityLogs.filter(
        (log) => log.taskId === taskId
      );
      setActivityLog(taskActivities);

      // Get comments for this task
      const filteredComments = comments.filter(
        (comment) => comment.taskId === taskId
      );
      setTaskComments(filteredComments);
    }
  }, [taskId]);

  if (!task) {
    return (
      <div className="h-screen flex flex-col">
        <Header currentUser={currentUser} />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-muted-foreground">Task not found</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getUserById = (userId: string): User => {
    return users.find((user) => user.id === userId) || users[0];
  };

  const handleStatusChange = (newStatus: "todo" | "in-progress" | "done") => {
    setTask((prevTask) => {
      if (!prevTask) return null;
      return { ...prevTask, status: newStatus };
    });

    // Add to activity log
    const newActivity: ActivityLogItem = {
      id: `act${Date.now()}`,
      taskId: task.id,
      userId: currentUser.id,
      action: "status_changed",
      timestamp: new Date().toISOString(),
      details: `${task.status} → ${newStatus}`,
    };

    setActivityLog((prev) => [newActivity, ...prev]);
    toast.success(`Task status updated to ${newStatus.replace("-", " ")}`);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    // Add new comment
    const newCommentObj: Comment = {
      id: `com${Date.now()}`,
      taskId: task.id,
      userId: currentUser.id,
      text: newComment,
      timestamp: new Date().toISOString(),
    };

    setTaskComments((prev) => [newCommentObj, ...prev]);

    // Add to activity log
    const newActivity: ActivityLogItem = {
      id: `act${Date.now()}`,
      taskId: task.id,
      userId: currentUser.id,
      action: "comment_added",
      timestamp: new Date().toISOString(),
      details: newComment,
    };

    setActivityLog((prev) => [newActivity, ...prev]);
    setNewComment("");
    toast.success("Comment added successfully");
  };

  return (
    <div className="h-screen flex flex-col">
      <Header currentUser={currentUser} />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1 mb-6 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </Link>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Task details */}
            <div className="md:w-2/3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{task.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Status</h3>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            task.status === "todo" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleStatusChange("todo")}
                        >
                          To Do
                        </Button>
                        <Button
                          variant={
                            task.status === "in-progress"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleStatusChange("in-progress")}
                        >
                          In Progress
                        </Button>
                        <Button
                          variant={
                            task.status === "done" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handleStatusChange("done")}
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-2">Assignees</h3>
                      <div className="flex">
                        {task.assignees.map((assignee) => (
                          <Link key={assignee.id} to={`/users/${assignee.id}`}>
                            <Avatar className="h-8 w-8 border-2 border-background -ml-2 first:ml-0">
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
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full h-8 w-8 -ml-2"
                        >
                          <span className="text-xs">+</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>
                        {Math.round((task.progress / task.totalProgress) * 100)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={(task.progress / task.totalProgress) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Created: {task.date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{taskComments.length} Comments</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Paperclip className="h-4 w-4" />
                        <span>{task.attachments} Attachments</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-2"
                    />
                    <Button onClick={handleAddComment}>Add Comment</Button>
                  </div>

                  <div className="space-y-4 mt-6">
                    {taskComments.length > 0 ? (
                      taskComments.map((comment) => {
                        const commentUser = getUserById(comment.userId);
                        return (
                          <div key={comment.id} className="flex gap-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={commentUser.avatar}
                                alt={commentUser.name}
                              />
                              <AvatarFallback>
                                {commentUser.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {commentUser.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comment.timestamp)}
                                </span>
                              </div>
                              <p className="mt-1">{comment.text}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-muted-foreground">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity feed */}
            <div className="md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLog.length > 0 ? (
                      activityLog.map((activity) => {
                        const user = getUserById(activity.userId);
                        return (
                          <div key={activity.id} className="flex gap-4">
                            <div className="mt-0.5">
                              {activity.action === "created" && (
                                <FileText className="h-5 w-5 text-blue-500" />
                              )}
                              {activity.action === "status_changed" && (
                                <AlertCircle className="h-5 w-5 text-amber-500" />
                              )}
                              {activity.action === "comment_added" && (
                                <MessageSquare className="h-5 w-5 text-green-500" />
                              )}
                              {activity.action === "assigned" && (
                                <CheckCircle className="h-5 w-5 text-purple-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <span className="font-medium">
                                    {user.name}{" "}
                                  </span>
                                  <span>
                                    {activity.action === "created" &&
                                      "created this task"}
                                    {activity.action === "status_changed" &&
                                      `changed status to ${
                                        activity.details?.split(" → ")[1]
                                      }`}
                                    {activity.action === "comment_added" &&
                                      "added a comment"}
                                    {activity.action === "assigned" &&
                                      "was assigned to this task"}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {formatDate(activity.timestamp)}
                              </div>
                              {activity.action === "comment_added" &&
                                activity.details && (
                                  <p className="mt-1 text-sm border-l-2 border-muted pl-2">
                                    {activity.details}
                                  </p>
                                )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-muted-foreground">
                        No activity recorded yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
