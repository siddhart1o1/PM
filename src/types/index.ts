
export interface Task {
  id: string;
  title: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  assignees: string[];
  dueDate?: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  lastUpdated: string;
  category: string;
  progress: number;
  teamMembers: string[];
}
