import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/Colors';
import ProgressCircle from '../../components/ProgressCircle';
import TaskCard from '../../components/TaskCard';
import TaskGroupCard from '../../components/TaskGroupCard';
import Button from '../../components/Button';
import { getUserData } from '../../services/authService';
import { getAllTasks } from '../../services/taskService';
import { getAllTaskGroups } from '../../services/taskGroupService';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskGroups, setTaskGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayProgress, setTodayProgress] = useState(0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const loadData = async () => {
    try {
      const [userData, tasksData, groupsData] = await Promise.all([
        getUserData(),
        getAllTasks(),
        getAllTaskGroups(),
      ]);

      setUser(userData);
      setTasks(tasksData);
      setTaskGroups(groupsData);

      // Calculate today's progress
      const todayTasks = tasksData.filter(task => {
        const taskDate = new Date(task.createdAt);
        const today = new Date();
        return taskDate.toDateString() === today.toDateString();
      });

      if (todayTasks.length > 0) {
        const completedToday = todayTasks.filter(task => task.status === 'Completed').length;
        const progress = (completedToday / todayTasks.length) * 100;
        setTodayProgress(progress);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').slice(0, 3);
  const displayGroups = taskGroups.slice(0, 4);

  const handleTaskPress = (task) => {
    Alert.alert(
      task.title,
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => {} },
      ]
    );
  };

  const handleGroupPress = (group) => {
    Alert.alert(
      group.name,
      `${group.totalTasks || 0} tasks in this group`,
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'User'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <ProgressCircle
            progress={todayProgress}
            size={100}
            strokeWidth={8}
            color={Colors.surface}
            backgroundColor="rgba(255, 255, 255, 0.3)"
          />
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Your today's task</Text>
            <Text style={styles.progressTitle}>almost done!</Text>
            <TouchableOpacity
              style={styles.viewTaskButton}
              onPress={() => router.push('/(tabs)/tasks')}
            >
              <Text style={styles.viewTaskText}>View Task</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* In Progress Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>In Progress</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{inProgressTasks.length}</Text>
            </View>
          </View>

          {inProgressTasks.length > 0 ? (
            <>
              {inProgressTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onPress={() => handleTaskPress(task)}
                />
              ))}
              {tasks.filter(t => t.status === 'In Progress').length > 3 && (
                <Button
                  title="See All Tasks"
                  onPress={() => router.push('/(tabs)/tasks')}
                  variant="ghost"
                  style={styles.seeAllButton}
                />
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyStateText}>No tasks in progress</Text>
            </View>
          )}
        </View>

        {/* Task Groups Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Task Groups</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{taskGroups.length}</Text>
            </View>
          </View>

          {displayGroups.length > 0 ? (
            <>
              {displayGroups.map((group) => (
                <TaskGroupCard
                  key={group._id}
                  taskGroup={group}
                  onPress={() => handleGroupPress(group)}
                />
              ))}
              {taskGroups.length > 4 && (
                <Button
                  title="See All Groups"
                  onPress={() => router.push('/(tabs)/groups')}
                  variant="ghost"
                  style={styles.seeAllButton}
                />
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="folder-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyStateText}>No task groups yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressInfo: {
    marginLeft: 24,
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.surface,
  },
  viewTaskButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  viewTaskText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginRight: 8,
  },
  badge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  seeAllButton: {
    marginTop: 8,
  },
});
