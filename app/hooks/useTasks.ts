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
      completed: false,
      dueDate: taskData.dueDate instanceof Date ? taskData.dueDate.getTime() : taskData.dueDate,
      userId: user.uid,
      createdAt: now,
      updatedAt: now,
    };

    // Remove any undefined values
    Object.keys(task).forEach(key => {
      if (task[key] === undefined) {
        delete task[key];
      }
    });

    console.log('Creating new task:', task);

    try {
      await set(newTaskRef, task);
      console.log('Successfully created task');
      return { ...task, id: newTaskRef.key! };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    
    // Convert any Date objects to timestamps for Firebase
    const firebaseUpdates = {
      ...updates,
      dueDate: updates.dueDate instanceof Date ? updates.dueDate.getTime() : updates.dueDate,
      completed: updates.completed,
      completedAt: updates.completed ? Date.now() : null,
      updatedAt: Date.now(),
    };

    // Remove any undefined values as Firebase doesn't accept them
    Object.keys(firebaseUpdates).forEach(key => {
      if ((firebaseUpdates as any)[key] === undefined) {
        delete (firebaseUpdates as any)[key];
      }
    });

    console.log('Updating task in Firebase:', { taskId, updates: firebaseUpdates });

    // Update local state
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === taskId ? { ...t, ...updates } : t
      )
    );

    try {
      await update(taskRef, firebaseUpdates);
      console.log('Successfully updated task in Firebase');
    } catch (error) {
      console.error('Error updating task in Firebase:', error);
      throw error;
    }
    return updates;
  };

  const deleteTask = async (taskId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    await remove(taskRef);
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    console.log('Toggling task completion:', { taskId, currentTask: task });
    
    if (task) {
      console.log('Current completion status:', task.completed, 'Changing to:', !task.completed);
      await updateTask(taskId, { 
        completed: !task.completed
      });
      console.log('Task completion toggle completed');
    } else {
      console.warn('Task not found:', taskId);
    }
  }

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
