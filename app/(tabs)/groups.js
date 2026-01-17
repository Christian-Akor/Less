import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/Colors';
import TaskGroupCard from '../../components/TaskGroupCard';
import Button from '../../components/Button';
import { getAllTaskGroups, createTaskGroup, deleteTaskGroup } from '../../services/taskGroupService';

export default function GroupsScreen() {
  const [taskGroups, setTaskGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📋');
  const [selectedColor, setSelectedColor] = useState(Colors.primary);
  const [creating, setCreating] = useState(false);

  const availableIcons = ['📋', '💼', '👤', '📚', '💪', '🏠', '🎨', '💻', '🎯', '⭐'];
  const availableColors = [
    Colors.primary,
    Colors.secondary,
    Colors.accent,
    Colors.info,
    Colors.success,
    Colors.warning,
    Colors.danger,
    '#EC4899',
    '#F97316',
    '#8B5CF6',
  ];

  const loadTaskGroups = async () => {
    try {
      const data = await getAllTaskGroups();
      setTaskGroups(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load task groups');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTaskGroups();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTaskGroups();
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    setCreating(true);
    try {
      await createTaskGroup({
        name: newGroupName,
        icon: selectedIcon,
        color: selectedColor,
      });
      Alert.alert('Success', 'Task group created successfully!');
      setModalVisible(false);
      setNewGroupName('');
      setSelectedIcon('📋');
      setSelectedColor(Colors.primary);
      loadTaskGroups();
    } catch (error) {
      Alert.alert('Error', error);
    } finally {
      setCreating(false);
    }
  };

  const handleGroupPress = (group) => {
    Alert.alert(
      group.name,
      `${group.totalTasks || 0} tasks in this group`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteGroup(group._id, group.totalTasks),
        },
      ]
    );
  };

  const handleDeleteGroup = async (groupId, totalTasks) => {
    if (totalTasks > 0) {
      Alert.alert(
        'Cannot Delete',
        'This group contains tasks. Please delete or move the tasks first.'
      );
      return;
    }

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this group?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTaskGroup(groupId);
              Alert.alert('Success', 'Task group deleted successfully');
              loadTaskGroups();
            } catch (error) {
              Alert.alert('Error', error);
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setNewGroupName('');
    setSelectedIcon('📋');
    setSelectedColor(Colors.primary);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Task Groups</Text>
          <Text style={styles.subtitle}>{taskGroups.length} groups</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openCreateModal}>
          <Ionicons name="add" size={24} color={Colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Groups List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading groups...</Text>
          </View>
        ) : taskGroups.length > 0 ? (
          taskGroups.map((group) => (
            <TaskGroupCard
              key={group._id}
              taskGroup={group}
              onPress={() => handleGroupPress(group)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="folder-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyStateText}>No task groups yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Create your first group to organize your tasks
            </Text>
            <Button
              title="Create Group"
              onPress={openCreateModal}
              style={styles.createButton}
              icon="➕"
            />
          </View>
        )}
      </ScrollView>

      {/* Create Group Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Task Group</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                <Text style={styles.inputLabel}>Group Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter group name"
                  placeholderTextColor={Colors.textLight}
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                />

                <Text style={styles.inputLabel}>Icon</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.iconContainer}
                >
                  {availableIcons.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconButton,
                        selectedIcon === icon && styles.iconButtonActive,
                      ]}
                      onPress={() => setSelectedIcon(icon)}
                    >
                      <Text style={styles.iconText}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.inputLabel}>Color</Text>
                <View style={styles.colorContainer}>
                  {availableColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[styles.colorButton, { backgroundColor: color }]}
                      onPress={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && (
                        <Ionicons name="checkmark" size={20} color={Colors.surface} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <Button
                  title="Create Group"
                  onPress={handleCreateGroup}
                  loading={creating}
                  style={styles.modalCreateButton}
                />
                <Button
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                  variant="outline"
                  style={styles.modalCancelButton}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 24,
    gap: 12,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  iconButtonActive: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  iconText: {
    fontSize: 28,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCreateButton: {
    marginBottom: 12,
  },
  modalCancelButton: {},
});
