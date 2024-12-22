import { View, StyleSheet, FlatList, Pressable, Animated } from 'react-native';
import { Text, Card, IconButton, Chip, Portal, Dialog, Button, Checkbox, MD2Colors } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';
import { Task } from '../../types';
import { getPriorityColor, isOverdue } from '../../utils/taskUtils';
import { useState, useEffect } from 'react';
import React from 'react';
import theme from 'react-native-elements/dist/config/theme';

const sortByDueDate = (tasks: Task[]) => {
  return tasks.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};

type TaskListProps = {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  onToggleCompletion: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onAddSubTask: (task: Task) => void;
};

export const TaskList = ({ tasks, onTaskPress, onToggleCompletion, onDeleteTask, onEditTask, onAddSubTask }: TaskListProps) => {
  const { theme } = useTheme();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const handleCompleteConfirm = () => {
    if (taskToComplete) {
      onToggleCompletion(taskToComplete.id);
      setTaskToComplete(null);
    }
  };

  const TaskItem = ({ task }: { task: Task }) => {
    const backgroundColorAnim = React.useRef(new Animated.Value(0)).current;
    const checkmarkOpacity = React.useRef(new Animated.Value(0)).current;
    const isTaskOverdue = isOverdue(task);

    useEffect(() => {
      if (task.completed) {
        Animated.parallel([
          Animated.timing(backgroundColorAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(checkmarkOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(backgroundColorAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(checkmarkOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, [task.completed]);

    const backgroundColor = backgroundColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.surface, `${theme.colors.primary}10`]
    });

    return (
      <Animated.View style={{ backgroundColor }}>
        <Card
          style={[
            styles.taskCard,
            task.completed && styles.completedTaskCard
          ]}
          mode="outlined"
          onPress={() => onTaskPress(task)}
        >
          <Card.Content style={styles.taskContent}>
            <View style={styles.taskHeader}>
              <View style={styles.taskTitleContainer}>
                <Checkbox.Android
                  status={task.completed ? 'checked' : 'unchecked'}
                  onPress={() => setTaskToComplete(task)}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.taskTitle,
                    { color: theme.colors.onSurface },
                  ]}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>
                {isTaskOverdue && !task.completed && (
                  <Chip 
                    style={styles.overdueChip} 
                    textStyle={{ color: theme.colors.error }}
                    icon="alert-circle"
                  >
                    Overdue
                  </Chip>
                )}
                {task.completed && (
                  <Animated.View style={[styles.checkmark, { opacity: checkmarkOpacity }]}>
                    <IconButton
                      icon="check-circle"
                      iconColor={theme.colors.primary}
                      size={24}
                    />
                  </Animated.View>
                )}
              </View>
            </View>
            <View style={styles.taskBody}>
              {task.description && (
                <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
                  {task.description}
                </Text>
              )}
              {task.dueDate && (
                <Text style={[styles.dueDate, { color: theme.colors.onSurfaceVariant }]}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Text>
              )}
              <View style={styles.taskMeta}>
                <Chip
                  style={[styles.categoryChip, { backgroundColor: theme.colors.primaryContainer }]}
                  textStyle={{ color: theme.colors.onPrimaryContainer }}
                >
                  {task.category}
                </Chip>
                <Chip
                  key={task.priority}
                  style={[
                    styles.priorityChip,
                    { backgroundColor: getPriorityColor(task.priority) + '20' }  // Adding 20% opacity
                  ]}
                  textStyle={{ color: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </Chip>
                <View style={styles.iconContainer}>
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => onEditTask(task)}
                    iconColor={theme.colors.primary}
                  />
                  <IconButton
                    icon="plus"
                    size={20}
                    onPress={() => onAddSubTask(task)}
                    iconColor={theme.colors.primary}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => setTaskToDelete(task)}
                    iconColor={theme.colors.error}
                  />
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    );
  };

  return (
    <>
      <FlatList
        data={sortByDueDate(tasks)}
        renderItem={({ item }) => <TaskItem task={item} />}
        keyExtractor={item => item.id}
        style={styles.taskList}
        contentContainerStyle={styles.taskListContent}
      />

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog 
          visible={!!taskToDelete} 
          onDismiss={() => setTaskToDelete(null)}
          style={styles.dialog}
        >
          <Dialog.Title>Delete Task</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to delete this task?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTaskToDelete(null)}>Cancel</Button>
            <Button onPress={handleDeleteConfirm}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Complete Confirmation Dialog */}
      <Portal>
        <Dialog 
          visible={!!taskToComplete} 
          onDismiss={() => setTaskToComplete(null)}
          style={styles.dialog}
        >
          <Dialog.Title>Complete Task</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Mark this task as completed?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTaskToComplete(null)}>Cancel</Button>
            <Button onPress={handleCompleteConfirm}>Complete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingBottom: 80,
  },
  taskCard: {
    marginBottom: 8,
  },
  taskContent: {
    padding: 8,
  },
  taskHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  taskBody: {
    flexDirection: 'column',
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  completedTaskCard: {
    opacity: 0.8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  priorityChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 14,
    marginVertical: 4,
    fontWeight: '500',
  },
  checkmark: {
    position: 'absolute',
    right: 8,
  },
  overdueChip: {
    position: 'absolute',
    right: 8,
  },
  dialog: {
    borderRadius: 15, // Less rounded corners
  },
});
