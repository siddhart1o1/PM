import { useState } from "react";
import Header from "@/components/Header";
import { users } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Star,
  Calendar,
  Mail,
  MapPin,
  Smartphone,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ProfilePage = () => {
  const [activeUser] = useState(users[0]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(activeUser.name);
  const [editedTitle, setEditedTitle] = useState("Product Designer");
  const [editedEmail, setEditedEmail] = useState(
    `${activeUser.name.toLowerCase()}@company.com`
  );
  const [editedPhone, setEditedPhone] = useState("+1 (555) 123-4567");
  const [editedLocation, setEditedLocation] = useState("San Francisco, CA");

  const handleProfileUpdate = () => {
    // In a real app, this would send data to the backend
    toast.success("Profile updated successfully!");
    setIsEditDialogOpen(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header currentUser={activeUser} />

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
                        src={activeUser.avatar}
                        alt={activeUser.name}
                      />
                      <AvatarFallback>
                        {activeUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold">{activeUser.name}</h2>
                    <p className="text-muted-foreground">Product Designer</p>

                    <div className="flex gap-2 mt-4">
                      <Badge variant="outline" className="px-3 py-1">
                        UI/UX
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        Design
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        Product
                      </Badge>
                    </div>

                    <div className="w-full mt-6 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{activeUser.name.toLowerCase()}@company.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <span>+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>San Francisco, CA</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Joined January 2022</span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile tabs */}
            <div className="md:w-2/3">
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-md p-4">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Star className="h-4 w-4 text-amber-500" />
                            <span>Completed "Design system update" task</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            2 days ago
                          </p>
                        </div>

                        <div className="border rounded-md p-4">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Star className="h-4 w-4 text-amber-500" />
                            <span>
                              Created "Create wireframe for ios app" task
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            5 days ago
                          </p>
                        </div>

                        <div className="border rounded-md p-4">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Star className="h-4 w-4 text-amber-500" />
                            <span>
                              Completed "Add product to the market" project
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            1 week ago
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tasks" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        View and manage your assigned tasks.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="projects" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        View and manage your projects.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h3 className="font-medium">
                                Personal Information
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Update your personal details
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>

                        <div className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h3 className="font-medium">Notifications</h3>
                              <p className="text-sm text-muted-foreground">
                                Manage notification preferences
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>

                        <div className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h3 className="font-medium">Security</h3>
                              <p className="text-sm text-muted-foreground">
                                Update password and security settings
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h3 className="font-medium">Billing</h3>
                              <p className="text-sm text-muted-foreground">
                                Manage billing and subscription
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editedLocation}
                onChange={(e) => setEditedLocation(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleProfileUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
