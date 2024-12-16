import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, Card, IconButton, Chip } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';
import { Task } from '../../types';
import { getPriorityColor } from '../../utils/taskUtils';

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

  const TaskItem = ({ task }: { task: Task }) => (
    <Card
      style={[styles.taskCard, { backgroundColor: theme.colors.surface }]}
      mode="outlined"
      onPress={() => onTaskPress(task)}
    >
      <Card.Content style={styles.taskContent}>
        <View style={styles.taskHeader}>
          <Text
            style={[
              styles.taskTitle,
              { color: theme.colors.onSurface },
              task.completed && styles.completedTask,
            ]}
          >
            {task.title}
          </Text>
        </View>
        <View style={styles.taskBody}>
          {task.description && (
            <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]} numberOfLines={2}>
              {task.description}
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
              style={[styles.priorityChip, { backgroundColor: getPriorityColor(task.priority) }]}
              textStyle={{ color: '#FFFFFF' }}
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
                onPress={() => onDeleteTask(task.id)}
                iconColor={theme.colors.error}
              />
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={sortByDueDate(tasks)}
      renderItem={({ item }) => <TaskItem task={item} />}
      keyExtractor={item => item.id}
      style={styles.taskList}
      contentContainerStyle={styles.taskListContent}
    />
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
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
});
