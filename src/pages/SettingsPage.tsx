import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const SettingsPage = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("account");

  // Account settings
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [language, setLanguage] = useState("english");
  const [timezone, setTimezone] = useState("utc");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [teamUpdates, setTeamUpdates] = useState(true);

  // Appearance settings
  const [theme, setTheme] = useState("system");
  const [density, setDensity] = useState("comfortable");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Integration settings
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [slackEnabled, setSlackEnabled] = useState(true);
  const [githubEnabled, setGithubEnabled] = useState(false);

  const handleSaveAccount = () => {
    toast.success("Account settings saved");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences updated");
  };

  const handleSaveAppearance = () => {
    toast.success("Appearance settings updated");
  };

  const handleIntegrationToggle = (integration: string, enabled: boolean) => {
    toast.success(
      `${integration} integration ${enabled ? "enabled" : "disabled"}`
    );
  };

  const handleExportData = () => {
    toast.info("Exporting your data...");
    setTimeout(() => {
      toast.success("Data exported successfully!");
    }, 2000);
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is disabled in this demo");
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className={`grid ${
                isMobile ? "grid-cols-2 gap-2 mb-4" : "grid-cols-4"
              } w-full`}
            >
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>

            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and how we can reach you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input
                        id="full-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                          <SelectItem value="est">
                            Eastern Time (GMT-5)
                          </SelectItem>
                          <SelectItem value="pst">
                            Pacific Time (GMT-8)
                          </SelectItem>
                          <SelectItem value="cet">
                            Central European Time (GMT+1)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveAccount}>Save Changes</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data & Privacy</CardTitle>
                  <CardDescription>
                    Manage your data and privacy settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Export Your Data</p>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of all your data
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleExportData}>
                      Export
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-destructive">
                        Delete Account
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all your data
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how and when you want to be notified.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications in your browser
                        </p>
                      </div>
                      <Switch
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Task Reminders</p>
                        <p className="text-sm text-muted-foreground">
                          Get reminders about upcoming tasks
                        </p>
                      </div>
                      <Switch
                        checked={taskReminders}
                        onCheckedChange={setTaskReminders}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Deadline Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts about approaching deadlines
                        </p>
                      </div>
                      <Switch
                        checked={deadlineAlerts}
                        onCheckedChange={setDeadlineAlerts}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Team Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about team activities
                        </p>
                      </div>
                      <Switch
                        checked={teamUpdates}
                        onCheckedChange={setTeamUpdates}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme & Appearance</CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="density">Interface Density</Label>
                      <Select value={density} onValueChange={setDensity}>
                        <SelectTrigger id="density">
                          <SelectValue placeholder="Select density" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comfortable">
                            Comfortable
                          </SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <p className="font-medium">Interface Animations</p>
                        <p className="text-sm text-muted-foreground">
                          Enable animations throughout the application
                        </p>
                      </div>
                      <Switch
                        checked={animationsEnabled}
                        onCheckedChange={setAnimationsEnabled}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveAppearance}>
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Integrations Settings */}
            <TabsContent value="integrations" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>
                    Connect with other tools and services.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Google Calendar</p>
                        <p className="text-sm text-muted-foreground">
                          Sync tasks with your Google Calendar
                        </p>
                      </div>
                      <Switch
                        checked={googleEnabled}
                        onCheckedChange={(enabled) => {
                          setGoogleEnabled(enabled);
                          handleIntegrationToggle("Google Calendar", enabled);
                        }}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Slack</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications in Slack
                        </p>
                      </div>
                      <Switch
                        checked={slackEnabled}
                        onCheckedChange={(enabled) => {
                          setSlackEnabled(enabled);
                          handleIntegrationToggle("Slack", enabled);
                        }}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">GitHub</p>
                        <p className="text-sm text-muted-foreground">
                          Connect with your GitHub repositories
                        </p>
                      </div>
                      <Switch
                        checked={githubEnabled}
                        onCheckedChange={(enabled) => {
                          setGithubEnabled(enabled);
                          handleIntegrationToggle("GitHub", enabled);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
