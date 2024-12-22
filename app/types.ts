export interface Task {
  [x: string]: any;
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: Date;
  completed: boolean;
  completedAt?: number;
  userId: string;
  createdAt: number;
  updatedAt: number;
  subTasks?: SubTask[];
}

export enum TaskCategory {
  WORK = 'Work',
  PERSONAL = 'Personal',
  URGENT = 'Urgent',
}

export enum TaskPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskFilter {
  [x: string]: any;
  category?: string | TaskCategory;
  priority?: string;
  completed?: boolean;
  searchQuery?: string;
}
