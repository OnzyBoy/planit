export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskCategory = 'Work' | 'Personal' | 'Urgent';
export type TaskStatus = 'Pending' | 'InProgress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  dueDate?: Date;
  userId: string;
  createdAt: number;
  updatedAt: number;
  subTasks?: Task[];
}

export type TaskFilter = {
  category?: TaskCategory | 'All';
  priority?: TaskPriority | 'All';
  searchQuery?: string;
  showCompleted?: boolean;
};
