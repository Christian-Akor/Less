import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/Colors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { createTask } from '../../services/taskService';
import { getAllTaskGroups } from '../../services/taskGroupService';

export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [taskGroups, setTaskGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const priorities = [
    { label: 'Low', icon: 'arrow-down', color: Colors.info },
    { label: 'Medium', icon: 'remove', color: Colors.warning },
    { label: 'High', icon: 'arrow-up', color: Colors.danger },
  ];

  useEffect(() => {
    loadTaskGroups();
  }, []);

  const loadTaskGroups = async () => {
    try {
      const data = await getAllTaskGroups();
      setTaskGroups(data);
      if (data.length > 0) {
        setSelectedGroup(data[0]._id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load task groups');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTask = async () => {
    if (!validateForm()) {
      return;
    }

    if (!selectedGroup) {
      Alert.alert('Error', 'Please select a task group');
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title,
        description,
        priority,
        taskGroup: selectedGroup,
        status: 'To Do',
        progress: 0,
      });

      Alert.alert('Success', 'Task created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Clear form
            setTitle('');
            setDescription('');
            setPriority('Low');
            setSelectedGroup(taskGroups.length > 0 ? taskGroups[0]._id : null);
            // Navigate to tasks
            router.push('/(tabs)/tasks');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setPriority('Low');
    setSelectedGroup(taskGroups.length > 0 ? taskGroups[0]._id : null);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Create New Task</Text>
              <Text style={styles.subtitle}>Add a new task to your list</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Task Title *"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              placeholder="Enter task title"
              icon="create-outline"
              error={errors.title}
            />

            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description (optional)"
              icon="document-text-outline"
              multiline
              numberOfLines={4}
            />

            {/* Priority Selector */}
            <View style={styles.section}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityContainer}>
                {priorities.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    style={[
                      styles.priorityButton,
                      priority === item.label && [
                        styles.priorityButtonActive,
                        { backgroundColor: item.color + '20' },
                      ],
                    ]}
                    onPress={() => setPriority(item.label)}
                  >
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={priority === item.label ? item.color : Colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.priorityText,
                        priority === item.label && [
                          styles.priorityTextActive,
                          { color: item.color },
                        ],
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Task Group Selector */}
            <View style={styles.section}>
              <Text style={styles.label}>Task Group *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.groupContainer}
              >
                {taskGroups.map((group) => (
                  <TouchableOpacity
                    key={group._id}
                    style={[
                      styles.groupButton,
                      selectedGroup === group._id && [
                        styles.groupButtonActive,
                        { borderColor: group.color },
                      ],
                    ]}
                    onPress={() => setSelectedGroup(group._id)}
                  >
                    <View
                      style={[
                        styles.groupIcon,
                        { backgroundColor: group.color + '20' },
                      ]}
                    >
                      <Text style={styles.groupEmoji}>{group.icon}</Text>
                    </View>
                    <Text
                      style={[
                        styles.groupName,
                        selectedGroup === group._id && styles.groupNameActive,
                      ]}
                      numberOfLines={1}
                    >
                      {group.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {taskGroups.length === 0 && (
                <Text style={styles.noGroupsText}>
                  No task groups available. Create one in the Groups tab.
                </Text>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title="Create Task"
                onPress={handleCreateTask}
                loading={loading}
                icon="✓"
              />
              <Button
                title="Cancel"
                onPress={handleCancel}
                variant="outline"
                style={styles.cancelButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  form: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  priorityButtonActive: {
    borderWidth: 2,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  priorityTextActive: {
    fontWeight: '700',
  },
  groupContainer: {
    gap: 12,
  },
  groupButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 100,
  },
  groupButtonActive: {
    borderWidth: 3,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  groupEmoji: {
    fontSize: 24,
  },
  groupName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  groupNameActive: {
    color: Colors.text,
  },
  noGroupsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
  buttonContainer: {
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 12,
  },
});
