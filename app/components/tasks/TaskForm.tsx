import React from 'react';
import { View, StyleSheet, TextInput, Platform, ScrollView } from 'react-native';
import { Text, Button, Chip, Portal, Modal, Surface, IconButton } from 'react-native-paper';
import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Task, TaskCategory, TaskPriority } from '../../types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getPriorityColor } from '../../utils/taskUtils';
import { MaterialIcons } from '@expo/vector-icons';

const today = new Date();
today.setHours(0, 0, 0, 0);

type TaskFormProps = {
  visible: boolean;
  onDismiss: () => void;
  onSave: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  initialTask?: Partial<Task>;
};

export const TaskForm = React.memo(({ visible, onDismiss, onSave, initialTask }: TaskFormProps) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category || 'Personal');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || 'Medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(initialTask?.dueDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = React.useCallback(() => {
    if (!title.trim()) return;
    if (dueDate && dueDate < today) {
      alert('Due date cannot be in the past. Please select a valid date.');
      return;
    }
    onSave({
      title,
      description,
      category,
      priority,
      completed: false,
      dueDate,
    });
    onDismiss();
  }, [title, description, category, priority, dueDate, onSave, onDismiss]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.background }
        ]}
      >
        <View style={styles.modalHeader}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            {initialTask ? 'Edit Task' : 'New Task'}
          </Text>
          <IconButton icon="close" size={20} onPress={onDismiss} iconColor={theme.colors.onBackground} style={styles.closeButton} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Surface style={[styles.inputContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
            <MaterialIcons name="title" size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />
            <TextInput
              placeholder="Task Title"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={title}
              onChangeText={setTitle}
              style={[
                styles.input, 
                { 
                  color: theme.colors.onSurface, 
                  backgroundColor: 'transparent'
                }
              ]}
            />
          </Surface>

          <Surface style={[styles.inputContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
            <MaterialIcons name="description" size={24} color={theme.colors.onSurfaceVariant} style={styles.icon} />
            <TextInput
              placeholder="Description"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              value={description}
              onChangeText={setDescription}
              multiline
              style={[styles.input, { color: theme.colors.onSurface }]}
            />
          </Surface>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Category</Text>
            <View style={styles.chipGroup}>
              {(['Work', 'Personal', 'Urgent'] as const).map((cat) => (
                <Chip
                  key={cat}
                  selected={category === cat}
                  onPress={() => setCategory(cat)}
                  style={styles.chip}
                >
                  {cat}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Priority</Text>
            <View style={styles.chipGroup}>
              {(['High', 'Medium', 'Low'] as const).map((pri) => (
                <Chip
                  key={pri}
                  selected={priority === pri}
                  onPress={() => setPriority(pri)}
                  style={[styles.chip, { backgroundColor: getPriorityColor(pri) }]}
                  textStyle={{ color: '#FFFFFF' }}
                >
                  {pri}
                </Chip>
              ))}
            </View>
          </View>

          <Button 
            onPress={() => setShowDatePicker(true)} 
            mode="outlined" 
            style={styles.dateButton}
            icon="calendar"
          >
            {dueDate ? dueDate.toLocaleDateString() : 'Set Due Date'}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate || today}
              mode="date"
              minimumDate={today}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDueDate(selectedDate);
              }}
            />
          )}

          <Button 
            onPress={handleSave} 
            mode="contained" 
            style={styles.saveButton}
          >
            Save Task
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    minHeight: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    ...Platform.select({
      ios: {
        paddingVertical: 12,
      },
      android: {
        paddingVertical: 8,
      },
      web: {
        outlineStyle: 'none',
        paddingVertical: 8,
      },
    }),
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  dateButton: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 8,
  },
});
