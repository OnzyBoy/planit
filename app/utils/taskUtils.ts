import { Task, TaskFilter, TaskPriority } from '../types';

export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  return tasks.filter(task => {
    const matchesSearch = !filter.searchQuery || 
      task.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(filter.searchQuery.toLowerCase());

    const matchesCategory = !filter.category || 
      filter.category === 'All' || 
      task.category === filter.category;

    const matchesPriority = !filter.priority || 
      filter.priority === 'All' || 
      task.priority === filter.priority;

    const matchesCompletion = filter.showCompleted !== undefined ? 
      filter.showCompleted === task.completed : 
      true;

    return matchesSearch && matchesCategory && matchesPriority && matchesCompletion;
  });
};

export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'High':
      return '#FF4444';
    case 'Medium':
      return '#FFA000';
    case 'Low':
      return '#4CAF50';
  }
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
