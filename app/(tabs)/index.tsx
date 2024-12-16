import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Chip, Searchbar, ActivityIndicator } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import { useState } from 'react';
import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskList } from '../components/tasks/TaskList';
import { SubTaskList } from '../components/tasks/SubTaskList';

export default function TasksScreen() {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [subTaskModalVisible, setSubTaskModalVisible] = useState(false);
  const [taskForSubTask, setTaskForSubTask] = useState<Task | undefined>();
  
  const {
    tasks,
    loading,
    error,
    filter,
    setFilter,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  } = useTasks();

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>{error}</Text>
      </View>
    );
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleAddSubTask = (task: Task) => {
    setTaskForSubTask(task);
    setSubTaskModalVisible(true);
  };

  const handleSaveSubTask = (subTaskTitle: string) => {
    if (!taskForSubTask) return;
    const updatedSubTasks = [...(taskForSubTask.subTasks || []), { id: String(Date.now()), title: subTaskTitle }];
    updateTask(taskForSubTask.id, { subTasks: updatedSubTasks });
    setSubTaskModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search tasks"
        onChangeText={(query) => setFilter({ ...filter, searchQuery: query })}
        value={filter.searchQuery || ''}
        style={styles.searchBar}
      />
      
      <View style={styles.filterSection}>
        <FlatList
          horizontal
          data={['All', 'Work', 'Personal', 'Urgent']}
          renderItem={({ item }) => (
            <Chip
              selected={filter.category === item}
              onPress={() => setFilter({ ...filter, category: item as any })}
              style={styles.filterChip}
            >
              {item}
            </Chip>
          )}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          style={styles.filterList}
        />
        
        <FlatList
          horizontal
          data={['All', 'High', 'Medium', 'Low']}
          renderItem={({ item }) => (
            <Chip
              selected={filter.priority === item}
              onPress={() => setFilter({ ...filter, priority: item as any })}
              style={styles.filterChip}
            >
              {item}
            </Chip>
          )}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          style={styles.filterList}
        />
      </View>

      <TaskList
        tasks={tasks}
        onTaskPress={(task) => {
          setSelectedTask(task);
          setModalVisible(true);
        } }
        onToggleCompletion={toggleTaskCompletion}
        onDeleteTask={deleteTask} 
        onEditTask={handleEditTask} 
        onAddSubTask={handleAddSubTask}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          setSelectedTask(undefined);
          setModalVisible(true);
        }}
      />

      <TaskForm
        visible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
          setSelectedTask(undefined);
        }}
        onSave={selectedTask ? 
          (updates) => updateTask(selectedTask.id, updates) : 
          createTask
        }
        initialTask={selectedTask}
      />

      {subTaskModalVisible && taskForSubTask && (
        <SubTaskList visible={subTaskModalVisible} onDismiss={() => setSubTaskModalVisible(false)} onSave={handleSaveSubTask} task={taskForSubTask} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterList: {
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
