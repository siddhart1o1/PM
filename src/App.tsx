import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Index from "./pages/Index";
import BoardPage from "./pages/BoardPage";
import ProjectsPage from "./pages/ProjectsPage";
import TasksPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import SettingsPage from "./pages/SettingsPage";
import RemindersPage from "./pages/RemindersPage";
import MessengersPage from "./pages/MessengersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<Layout />}>
            <Route path="/board" element={<BoardPage />} />
            <Route path="/projects/:id?" element={<ProjectsPage />} />
            <Route path="/tasks/:id?" element={<TasksPage />} />
            <Route path="/task/:taskId" element={<TaskDetailsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/messengers" element={<MessengersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users/:userId" element={<UserProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
