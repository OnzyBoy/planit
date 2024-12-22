import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, ScrollView, TextInput as RNTextInput } from 'react-native';
import { Text, Modal, Portal, Button, TextInput, IconButton } from 'react-native-paper';
import { Task } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface SubTaskListProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (subTaskTitle: string) => void;
  task: Task;
}

export const SubTaskList: React.FC<SubTaskListProps> = ({ visible, onDismiss, onSave, task }) => {
  const { theme } = useTheme();
  const [subTaskValue, setSubTaskValue] = useState('');
  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    if (visible) {
      setSubTaskValue('');
    }
  }, [visible]);

  const handleSave = () => {
    if (subTaskValue.trim()) {
      onSave(subTaskValue);
      setSubTaskValue('');
      // Clear the input after saving
      if (inputRef.current) {
        inputRef.current.clear();
      }
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}> 
        <View style={styles.modalHeader}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Subtasks for {task.title}</Text>
          <IconButton icon="close" size={20} onPress={onDismiss} iconColor={theme.colors.onSurface} style={styles.closeButton} />
        </View>
        <ScrollView style={styles.scrollView}>
          <FlatList
            data={task.subTasks || []}
            renderItem={({ item }) => (
              <View style={styles.subTaskItem}>
                <Text style={{ color: theme.colors.onSurface }}>{item.title}</Text>
              </View>
            )}
            keyExtractor={item => item.id}
            style={styles.subTaskList}
          />
        </ScrollView>
        <TextInput
          ref={inputRef}
          placeholder="New Subtask"
          placeholderTextColor={theme.colors.onSurfaceVariant}
          defaultValue=""
          onChangeText={setSubTaskValue}
          style={[
            styles.input,
            { 
              backgroundColor: theme.colors.surfaceVariant,
              color: theme.colors.onSurface
            }
          ]}
        />
        <Button 
          mode="contained" 
          onPress={handleSave} 
          style={styles.saveButton} 
          disabled={!subTaskValue.trim()}
        >
          Add Subtask
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: 200,
    marginBottom: 16,
  },
  subTaskList: {
    marginBottom: 16,
  },
  subTaskItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  input: {
    marginBottom: 16,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveButton: {
    marginTop: 16,
  },
});
