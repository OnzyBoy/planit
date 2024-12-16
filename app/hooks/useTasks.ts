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

    const tasksRef = ref(db, `tasks/${user.uid}`);
    setLoading(true);

    const handleSnapshot = (snapshot: any) => {
      try {
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
      } catch (err) {
        setError('Error loading tasks');
        console.error('Error in task snapshot:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleError = (err: Error) => {
      setError('Error loading tasks');
      setLoading(false);
      console.error('Database error:', err);
    };

    onValue(tasksRef, handleSnapshot, handleError);
    return () => off(tasksRef);
  }, []);

  const createTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const tasksRef = ref(db, `tasks/${user.uid}`);
    const newTaskRef = push(tasksRef);
    const now = Date.now();

    const task: Omit<Task, 'id'> = {
      ...taskData,
      dueDate: taskData.dueDate,
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
    const updates_ = {
      ...updates,
      updatedAt: Date.now(),
    };
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
      await updateTask(taskId, { completed: !task.completed });
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
