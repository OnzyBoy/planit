import { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, remove, update, onValue, off } from 'firebase/database';
import { app, auth } from '../services/firebase';
import { Task, TaskFilter } from '../types';
import { filterTasks, sortTasks } from '../utils/taskUtils';

const db = getDatabase(app);

export const useTasks = (initialFilter: TaskFilter = {}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilter>(initialFilter);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    setLoading(true);
    const tasksRef = ref(db, `tasks/${user.uid}`);
    
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const tasks: Task[] = [];
      snapshot.forEach((childSnapshot: any) => {
        const task = childSnapshot.val();
        tasks.push({
          ...task,
          id: childSnapshot.key,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        });
      });
      
      setTasks(sortTasks(tasks));
      setError(null);
      setLoading(false);
    }, (error) => {
      setError('Error loading tasks');
      console.error('Error loading tasks:', error);
      setLoading(false);
    });

    return () => {
      off(tasksRef);
    };
  }, []);

  const createTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const tasksRef = ref(db, `tasks/${user.uid}`);
    const newTaskRef = push(tasksRef);
    const now = Date.now();

    const task: Omit<Task, 'id'> = {
      ...taskData,
      completed: false, // Initialize completed state
      dueDate: taskData.dueDate || undefined,
      userId: user.uid,
      createdAt: now,
      updatedAt: now,
    };

    await set(newTaskRef, task);
    return { ...task, id: newTaskRef.key! };
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    // Prepare updates for Firebase (timestamps)
    const updates_ = {
      ...updates,
      dueDate: updates.dueDate ? updates.dueDate.getTime() : undefined,
      completed: updates.completed !== undefined ? updates.completed : undefined,
      completedAt: updates.completedAt !== undefined ? updates.completedAt : undefined,
      updatedAt: Date.now(),
    };

    // Prepare updates for local state (keeping Date objects)
    const localUpdates = {
      ...updates,
      updatedAt: Date.now(),
    };

    // Update local state
    const currentTask = tasks.find(t => t.id === taskId);
    if (currentTask) {
      setTasks(tasks.map(t => 
        t.id === taskId 
          ? { ...t, ...localUpdates }
          : t
      ));
    }

    await update(taskRef, updates_);
    return updates_;
  };

  const deleteTask = async (taskId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    await remove(taskRef);
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { 
        completed: !task.completed,
        completedAt: !task.completed ? Date.now() : undefined
      });
    }
  };

  const filteredTasks = filterTasks(tasks, filter);

  return {
    tasks: filteredTasks,
    loading,
    error,
    filter,
    setFilter,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
};
