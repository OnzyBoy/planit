import { Task, TaskFilter, TaskPriority } from '../types';

export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  console.log('Filtering tasks:', { tasks, filter }); // Debug log
  return tasks.filter(task => {
    const matchesSearch = !filter.searchQuery || 
      task.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase() || '').includes(filter.searchQuery.toLowerCase());

    const matchesCategory = !filter.category || 
      filter.category === 'All' || 
      task.category === filter.category;

    const matchesPriority = !filter.priority || 
      filter.priority === 'All' || 
      task.priority === filter.priority;

    const matchesCompleted = filter.completed === undefined || task.completed === filter.completed;

    const result = matchesSearch && matchesCategory && matchesPriority && matchesCompleted;
    console.log('Task filter result:', { taskId: task.id, result, matchesSearch, matchesCategory, matchesPriority, matchesCompleted }); // Debug log
    return result;
  });
};

export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.HIGH:
      return '#FF3B30';  // Bright red
    case TaskPriority.MEDIUM:
      return '#FF9500';  // Orange
    case TaskPriority.LOW:
      return '#34C759';  // Green
    default:
      return '#8E8E93';  // Gray
  }
};

export const isOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.completed) return false;
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  
  // Set both dates to the start of their respective days for comparison
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return today.getTime() > dueDate.getTime();
};

export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // Then by due date if available
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    // Then by priority
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    // Finally by creation date
    return b.createdAt - a.createdAt;
  });
};
