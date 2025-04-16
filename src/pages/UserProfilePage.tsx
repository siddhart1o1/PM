import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { users, User, tasks, Task } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MapPin,
  Smartphone,
  Calendar,
  Star,
  MessageSquare,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [currentUser] = useState(users[0]); // Logged in user for header
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userTasks, setUserTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Find the user profile
    const foundUser = users.find((user) => user.id === userId);
    if (foundUser) {
      setUserProfile(foundUser);

      // Find tasks assigned to this user
      const assignedTasks = tasks.filter((task) =>
        task.assignees.some((assignee) => assignee.id === userId)
      );
      setUserTasks(assignedTasks);
    }
  }, [userId]);

  if (!userProfile) {
    return (
      <div className="h-screen flex flex-col">
        <Header currentUser={currentUser} />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const completedTasks = userTasks.filter(
    (task) => task.status === "done"
  ).length;
  const inProgressTasks = userTasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const pendingTasks = userTasks.filter(
    (task) => task.status === "todo"
  ).length;
  const completionRate =
    userTasks.length > 0
      ? Math.round((completedTasks / userTasks.length) * 100)
      : 0;

  return (
    <div className="h-screen flex flex-col">
      <Header currentUser={currentUser} />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* User info card */}
            <div className="md:w-1/3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage
                        src={userProfile.avatar}
                        alt={userProfile.name}
                      />
                      <AvatarFallback>
                        {userProfile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                    <p className="text-muted-foreground">Team Member</p>

                    <div className="flex gap-2 mt-4">
                      <Badge variant="outline" className="px-3 py-1">
                        UI/UX
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        Development
                      </Badge>
                    </div>

                    <div className="w-full mt-6 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {userProfile.name.toLowerCase()}@company.com
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span>+1 (555) 555-5555</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>San Francisco, CA</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Joined March 2022</span>
                      </div>
                    </div>

                    <Button className="w-full mt-6" variant="outline">
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Task Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Completion Rate</span>
                        <span className="text-sm font-medium">
                          {completionRate}%
                        </span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {completedTasks}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Completed
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {inProgressTasks}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          In Progress
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{pendingTasks}</div>
                        <div className="text-xs text-muted-foreground">
                          Pending
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile tabs */}
            <div className="md:w-2/3">
              <Tabs defaultValue="tasks">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="collaborations">
                    Collaborations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assigned Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userTasks.length > 0 ? (
                        <div className="space-y-4">
                          {userTasks.map((task) => (
                            <div
                              key={task.id}
                              className="border rounded-md p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{task.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {task.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                      variant={
                                        task.status === "todo"
                                          ? "outline"
                                          : task.status === "in-progress"
                                          ? "secondary"
                                          : "default"
                                      }
                                    >
                                      {task.status === "in-progress"
                                        ? "In Progress"
                                        : task.status === "todo"
                                        ? "To Do"
                                        : "Done"}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {task.date}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-2 text-sm">
                                    <MessageSquare className="h-3 w-3" />
                                    <span>{task.comments}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Progress</span>
                                  <span>
                                    {Math.round(
                                      (task.progress / task.totalProgress) * 100
                                    )}
                                    %
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (task.progress / task.totalProgress) * 100
                                  }
                                  className="h-1"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          No tasks assigned to this user.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userTasks.slice(0, 5).map((task, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Star className="h-4 w-4 text-amber-500" />
                              <span>
                                {task.status === "done"
                                  ? `Completed "${task.title}" task`
                                  : task.status === "in-progress"
                                  ? `Working on "${task.title}" task`
                                  : `Assigned to "${task.title}" task`}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {task.date}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="collaborations" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Collaborations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userTasks
                          .filter((task) => task.assignees.length > 1)
                          .map((task, index) => (
                            <div key={index} className="border rounded-md p-4">
                              <h3 className="font-medium">{task.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {task.description}
                              </p>
                              <div className="flex mt-2">
                                <div className="flex -space-x-2 overflow-hidden">
                                  {task.assignees.map((assignee, i) => (
                                    <Avatar
                                      key={i}
                                      className="h-6 w-6 border-2 border-background"
                                    >
                                      <AvatarImage
                                        src={assignee.avatar}
                                        alt={assignee.name}
                                      />
                                      <AvatarFallback>
                                        {assignee.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground ml-3 self-center">
                                  Collaborating with {task.assignees.length - 1}{" "}
                                  team member
                                  {task.assignees.length > 2 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
