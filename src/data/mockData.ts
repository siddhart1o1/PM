// Mock data for the project management board

export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  project: string;
  status: "todo" | "in-progress" | "done";
  progress: number;
  totalProgress: number;
  date: string;
  comments: number;
  attachments: number;
  assignees: User[];
};

export type Project = {
  id: string;
  name: string;
  count?: number;
};

// Users
export const users: User[] = [
  {
    id: "user1",
    name: "John",
    avatar: "https://ui-avatars.com/api/?name=J&background=a78bfa&color=fff",
  },
  {
    id: "user2",
    name: "Sarah",
    avatar: "https://ui-avatars.com/api/?name=S+P&background=a78bfa&color=fff",
  },
  {
    id: "user3",
    name: "Alex",
    avatar: "https://ui-avatars.com/api/?name=A+D&background=60a5fa&color=fff",
  },
];

// Projects
export const projects: Project[] = [
  { id: "all", name: "All projects", count: 3 },
  { id: "design", name: "Design system" },
  { id: "user", name: "User flow" },
  { id: "ux", name: "UX research" },
];

// Task categories
export const taskCategories: Project[] = [
  { id: "all", name: "All tasks", count: 11 },
  { id: "todo", name: "To do", count: 4 },
  { id: "progress", name: "In progress", count: 4 },
  { id: "done", name: "Done", count: 3 },
];

// Tasks
export const tasks: Task[] = [
  {
    id: "task1",
    title: "Design new UI presentation",
    description: "Dribbble marketing",
    project: "design",
    status: "todo",
    progress: 7,
    totalProgress: 10,
    date: "24 Aug 2022",
    comments: 7,
    attachments: 2,
    assignees: [users[0]],
  },
  {
    id: "task2",
    title: "Add more UI/UX mockups",
    description: "Pinterest promotion",
    project: "design",
    status: "todo",
    progress: 4,
    totalProgress: 10,
    date: "25 Aug 2022",
    comments: 0,
    attachments: 0,
    assignees: [users[0], users[1]],
  },
  {
    id: "task3",
    title: "Design few mobile screens",
    description: "Dropbox mobile app",
    project: "design",
    status: "todo",
    progress: 3,
    totalProgress: 10,
    date: "26 Aug 2022",
    comments: 6,
    attachments: 4,
    assignees: [users[0]],
  },
  {
    id: "task4",
    title: "Create a tweet and promote",
    description: "Twitter marketing",
    project: "ux",
    status: "todo",
    progress: 2,
    totalProgress: 14,
    date: "27 Aug 2022",
    comments: 0,
    attachments: 0,
    assignees: [users[1], users[2]],
  },
  {
    id: "task5",
    title: "Design system update",
    description: "Oreo website project",
    project: "design",
    status: "in-progress",
    progress: 3,
    totalProgress: 10,
    date: "12 Nov 2022",
    comments: 0,
    attachments: 0,
    assignees: [users[0], users[1]],
  },
  {
    id: "task6",
    title: "Create brand guideline",
    description: "Oreo branding project",
    project: "design",
    status: "in-progress",
    progress: 7,
    totalProgress: 10,
    date: "13 Nov 2022",
    comments: 2,
    attachments: 13,
    assignees: [users[0]],
  },
  {
    id: "task7",
    title: "Create wireframe for ios app",
    description: "Oreo ios app project",
    project: "ux",
    status: "in-progress",
    progress: 4,
    totalProgress: 10,
    date: "14 Nov 2022",
    comments: 0,
    attachments: 0,
    assignees: [users[1], users[2]],
  },
  {
    id: "task8",
    title: "Create UI kit for layout",
    description: "Crypto mobile app",
    project: "ux",
    status: "in-progress",
    progress: 3,
    totalProgress: 10,
    date: "15 Nov 2022",
    comments: 23,
    attachments: 12,
    assignees: [users[0]],
  },
  {
    id: "task9",
    title: "Add product to the market",
    description: "UI8 marketplace",
    project: "user",
    status: "done",
    progress: 10,
    totalProgress: 10,
    date: "6 Jan 2022",
    comments: 1,
    attachments: 5,
    assignees: [users[0]],
  },
  {
    id: "task10",
    title: "Launch product promotion",
    description: "Kickstarter campaign",
    project: "user",
    status: "done",
    progress: 10,
    totalProgress: 10,
    date: "7 Jan 2022",
    comments: 17,
    attachments: 3,
    assignees: [users[0]],
  },
  {
    id: "task11",
    title: "Make twitter banner",
    description: "Twitter marketing",
    project: "user",
    status: "done",
    progress: 10,
    totalProgress: 10,
    date: "8 Jan 2022",
    comments: 0,
    attachments: 0,
    assignees: [users[1], users[2]],
  },
];

// Activity log type definition
export type ActivityLogItem = {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  timestamp: string;
  details?: string;
};

// Comment type definition
export type Comment = {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  timestamp: string;
};

// Activity logs data
export const activityLogs: ActivityLogItem[] = [
  {
    id: "act1",
    taskId: "task1",
    userId: "user1",
    action: "created",
    timestamp: "2023-10-12T14:30:00Z",
  },
  {
    id: "act2",
    taskId: "task1",
    userId: "user2",
    action: "status_changed",
    timestamp: "2023-10-14T09:15:00Z",
    details: "todo → in-progress",
  },
  {
    id: "act3",
    taskId: "task1",
    userId: "user1",
    action: "comment_added",
    timestamp: "2023-10-15T11:22:00Z",
    details: "Let's try to complete this by Friday.",
  },
  {
    id: "act4",
    taskId: "task1",
    userId: "user3",
    action: "assigned",
    timestamp: "2023-10-16T13:45:00Z",
  },
  {
    id: "act5",
    taskId: "task2",
    userId: "user1",
    action: "created",
    timestamp: "2023-09-20T10:00:00Z",
  },
  {
    id: "act6",
    taskId: "task2",
    userId: "user2",
    action: "comment_added",
    timestamp: "2023-09-22T14:35:00Z",
    details: "This looks good. Let's proceed.",
  },
];

// Comments data
export const comments: Comment[] = [
  {
    id: "com1",
    taskId: "task1",
    userId: "user1",
    text: "Let's try to complete this by Friday.",
    timestamp: "2023-10-15T11:22:00Z",
  },
  {
    id: "com2",
    taskId: "task1",
    userId: "user2",
    text: "I agree, I'll work on the design part.",
    timestamp: "2023-10-15T13:40:00Z",
  },
  {
    id: "com3",
    taskId: "task2",
    userId: "user2",
    text: "This looks good. Let's proceed.",
    timestamp: "2023-09-22T14:35:00Z",
  },
];

// Reminder type definition
export type Reminder = {
  id: string;
  title: string;
  time: string;
  priority: "high" | "medium" | "low";
};

// Messenger type definition
export type Messenger = {
  id: string;
  name: string;
  unread: number;
};

// Reminders data
export const reminders: Reminder[] = [
  {
    id: "reminder1",
    title: "Team meeting",
    time: "Today, 2:00 PM",
    priority: "high",
  },
  {
    id: "reminder2",
    title: "Project deadline",
    time: "Tomorrow, 10:00 AM",
    priority: "high",
  },
  {
    id: "reminder3",
    title: "Follow up with client",
    time: "Wed, 11:30 AM",
    priority: "low",
  },
];

// Messengers data
export const messengers: Messenger[] = [
  {
    id: "messenger1",
    name: "Team Chat",
    unread: 5,
  },
  {
    id: "messenger2",
    name: "Marketing",
    unread: 3,
  },
  {
    id: "messenger3",
    name: "Development",
    unread: 11,
  },
  {
    id: "messenger4",
    name: "Design",
    unread: 0,
  },
];
