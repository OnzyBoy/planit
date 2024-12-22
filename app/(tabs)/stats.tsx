import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Surface, ProgressBar, List, useTheme as usePaperTheme } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { isOverdue } from '../utils/taskUtils';

export default function StatsScreen() {
  const { theme } = useTheme();
  const paperTheme = usePaperTheme();
  const { tasks } = useTasks();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const overdueTasks = tasks.filter(task => isOverdue(task)).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) / 100 : 0;

  // Calculate priority distribution
  const priorityStats = tasks.reduce((acc: Record<string, number>, task) => {
    const priority = task.priority.toLowerCase();
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Overall Progress */}
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>Overall Progress</Text>
        <View style={styles.statsRow}>
          <Text style={[styles.statsNumber, { color: theme.colors.primary }]}>{completedTasks}</Text>
          <Text style={[styles.statsLabel, { color: theme.colors.onSurface }]}> / {totalTasks} Tasks Completed</Text>
        </View>
        <ProgressBar progress={completionRate} color={paperTheme.colors.primary} style={styles.progressBar} />
      </Surface>

      {/* Task Status */}
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>Task Status</Text>
        <List.Section>
          <List.Item
            title="Completed Tasks"
            right={() => <Text style={{ color: theme.colors.onSurface }}>{completedTasks}</Text>}
            left={() => <List.Icon color={paperTheme.colors.primary} icon="check-circle" />}
          />
          <List.Item
            title="Overdue Tasks"
            right={() => <Text style={{ color: paperTheme.colors.error }}>{overdueTasks}</Text>}
            left={() => <List.Icon color={paperTheme.colors.error} icon="alert-circle" />}
          />
          <List.Item
            title="Total Tasks"
            right={() => <Text style={{ color: theme.colors.onSurface }}>{totalTasks}</Text>}
            left={() => <List.Icon color={paperTheme.colors.secondary} icon="format-list-bulleted" />}
          />
        </List.Section>
      </Surface>

      {/* Task Distribution */}
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>Task Distribution</Text>
        <List.Section>
          <List.Item
            title="High Priority"
            right={() => <Text style={{ color: theme.colors.onSurface }}>{priorityStats['high'] || 0}</Text>}
            left={() => <List.Icon color={paperTheme.colors.error} icon="flag" />}
          />
          <List.Item
            title="Medium Priority"
            right={() => <Text style={{ color: theme.colors.onSurface }}>{priorityStats['medium'] || 0}</Text>}
            left={() => <List.Icon color={paperTheme.colors.tertiary} icon="flag" />}
          />
          <List.Item
            title="Low Priority"
            right={() => <Text style={{ color: theme.colors.onSurface }}>{priorityStats['low'] || 0}</Text>}
            left={() => <List.Icon color={paperTheme.colors.primary} icon="flag" />}
          />
        </List.Section>
      </Surface>

      {/* Productivity Tips */}
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>Productivity Insights</Text>
        <List.Section>
          {completionRate < 0.5 && (
            <List.Item
              title="Tip: Break Down Tasks"
              description="Try breaking large tasks into smaller subtasks for better progress tracking"
              left={() => <List.Icon icon="lightbulb" color={paperTheme.colors.primary} />}
            />
          )}
          {priorityStats['high'] > (priorityStats['low'] || 0) + (priorityStats['medium'] || 0) && (
            <List.Item
              title="High Priority Overload"
              description="Consider redistributing task priorities for better balance"
              left={() => <List.Icon icon="alert" color={paperTheme.colors.tertiary} />}
            />
          )}
          <List.Item
            title="Regular Updates"
            description="Keep marking tasks as complete to maintain accurate statistics"
            left={() => <List.Icon icon="chart-line" color={paperTheme.colors.primary} />}
          />
        </List.Section>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsLabel: {
    fontSize: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});
