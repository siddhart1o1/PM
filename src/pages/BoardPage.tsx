
import { useState } from "react";
import Header from "@/components/Header";
import Board from "@/components/Board";
import { Task, tasks as initialTasks } from "@/data/mockData";
import { toast } from "sonner";

const BoardPage = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleTaskMove = (taskId: string, newStatus: "todo" | "in-progress" | "done") => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    
    // Show toast notification
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast.success(`Task "${task.title}" moved to ${newStatus.replace("-", " ")}`);
    }
  };

  const handleTaskAdd = (newTask: Partial<Task>) => {
    const taskId = `task${tasks.length + 1}`;
    
    // Create new task with required fields
    const task: Task = {
      id: taskId,
      title: newTask.title || "New Task",
      description: newTask.description || "",
      project: "design",
      status: newTask.status || "todo",
      progress: newTask.progress || 0,
      totalProgress: newTask.totalProgress || 10,
      date: newTask.date || new Date().toLocaleDateString(),
      comments: newTask.comments || 0,
      attachments: newTask.attachments || 0,
      assignees: newTask.assignees || [],
    };
    
    setTasks(prev => [...prev, task]);
    toast.success(`Task "${task.title}" created successfully`);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Board 
        tasks={tasks} 
        onTaskMove={handleTaskMove} 
        onTaskAdd={handleTaskAdd} 
      />
    </div>
  );
};

export default BoardPage;
