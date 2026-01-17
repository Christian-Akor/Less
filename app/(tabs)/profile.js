import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Colors from '../../constants/Colors';
import Button from '../../components/Button';
import { logout, getUserData } from '../../services/authService';
import { getProfile, deleteAccount } from '../../services/userService';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, totalGroups: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [userData, profileData] = await Promise.all([
        getUserData(),
        getProfile(),
      ]);
      
      setUser(userData || profileData.user);
      setStats({
        totalTasks: profileData.totalTasks || 0,
        completedTasks: profileData.completedTasks || 0,
        totalGroups: profileData.totalGroups || 0,
      });
    } catch (error) {
      const userData = await getUserData();
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', error);
            }
          },
        },
      ]
    );
  };

  const getMemberSince = () => {
    if (!user?.createdAt) return 'Recently';
    const date = new Date(user.createdAt);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getAvatarUrl = (name) => {
    const initials = name?.split(' ').map(n => n[0]).join('') || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=8B5CF6&color=fff&size=128`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
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
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: getAvatarUrl(user?.name) }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
          <Text style={styles.memberSince}>Member since {getMemberSince()}</Text>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: Colors.primary + '15' }]}>
            <Ionicons name="list" size={24} color={Colors.primary} />
            <Text style={styles.statNumber}>{stats.totalTasks}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.success + '15' }]}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.statNumber}>{stats.completedTasks}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.accent + '15' }]}>
            <Ionicons name="folder" size={24} color={Colors.accent} />
            <Text style={styles.statNumber}>{stats.totalGroups}</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
        </View>

        {/* Settings Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="person-outline" size={20} color={Colors.text} />
                <Text style={styles.menuText}>Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="notifications-outline" size={20} color={Colors.text} />
                <Text style={styles.menuText}>Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="color-palette-outline" size={20} color={Colors.text} />
                <Text style={styles.menuText}>Appearance</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* About Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="help-circle-outline" size={20} color={Colors.text} />
                <Text style={styles.menuText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="document-text-outline" size={20} color={Colors.text} />
                <Text style={styles.menuText}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="information-circle-outline" size={20} color={Colors.text} />
                <Text style={styles.menuText}>About LESS</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>LESS</Text>
          <Text style={styles.appTagline}>Do more, stress LESS</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="🚪 Logout"
            onPress={handleLogout}
            variant="outline"
          />
          <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteLink}>
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 12,
    color: Colors.textLight,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: 48,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
  },
  appTagline: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  appVersion: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 8,
  },
  actions: {
    paddingHorizontal: 24,
  },
  deleteLink: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  deleteText: {
    fontSize: 14,
    color: Colors.danger,
    textDecorationLine: 'underline',
  },
});
