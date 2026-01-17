import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/Colors';
import TaskCard from '../../components/TaskCard';
import { getAllTasks, deleteTask, completeTask } from '../../services/taskService';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    { label: 'All', icon: 'list' },
    { label: 'To Do', icon: 'ellipse-outline' },
    { label: 'In Progress', icon: 'time' },
    { label: 'Completed', icon: 'checkmark-circle' },
  ];

  const loadTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
      applyFilters(data, activeFilter, searchQuery);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTasks();
  }, []);

  const applyFilters = (taskList, filter, search) => {
    let filtered = taskList;

    // Apply status filter
    if (filter !== 'All') {
      filtered = filtered.filter(task => task.status === filter);
    }

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilters(tasks, filter, searchQuery);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    applyFilters(tasks, activeFilter, text);
  };

  const handleTaskPress = (task) => {
    Alert.alert(
      task.title,
      'What would you like to do?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Complete',
          onPress: () => handleCompleteTask(task._id),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteTask(task._id),
        },
      ]
    );
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
      Alert.alert('Success', 'Task completed!');
      loadTasks();
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
              Alert.alert('Success', 'Task deleted successfully');
              loadTasks();
            } catch (error) {
              Alert.alert('Error', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Tasks</Text>
          <Text style={styles.taskCount}>{tasks.length} tasks</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.label}
            style={[
              styles.filterTab,
              activeFilter === filter.label && styles.filterTabActive,
            ]}
            onPress={() => handleFilterChange(filter.label)}
          >
            <Ionicons
              name={filter.icon}
              size={18}
              color={activeFilter === filter.label ? Colors.surface : Colors.textSecondary}
            />
            <Text
              style={[
                styles.filterText,
                activeFilter === filter.label && styles.filterTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Task List */}
      <ScrollView
        style={styles.taskList}
        contentContainerStyle={styles.taskListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading tasks...</Text>
          </View>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onPress={() => handleTaskPress(task)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name={searchQuery ? 'search' : 'list-outline'}
              size={48}
              color={Colors.textLight}
            />
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'No tasks found'
                : activeFilter === 'All'
                ? 'No tasks yet'
                : `No ${activeFilter.toLowerCase()} tasks`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  taskCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  filterScroll: {
    maxHeight: 50,
  },
  filterContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  filterTextActive: {
    color: Colors.surface,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
  },
});
