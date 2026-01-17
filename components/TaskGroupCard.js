import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import ProgressCircle from './ProgressCircle';

const TaskGroupCard = ({ taskGroup, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: taskGroup.color + '20' || Colors.card }]}>
          <Text style={styles.icon}>{taskGroup.icon || '📋'}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>{taskGroup.name}</Text>
          <Text style={styles.taskCount}>
            {taskGroup.totalTasks || 0} {taskGroup.totalTasks === 1 ? 'task' : 'tasks'}
          </Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <ProgressCircle 
          progress={taskGroup.progress || 0}
          size={50}
          strokeWidth={5}
          color={taskGroup.color || Colors.primary}
          showPercentage={false}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  taskCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  rightSection: {
    marginLeft: 12,
  },
});

export default TaskGroupCard;
