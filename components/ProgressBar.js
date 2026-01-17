import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';

const ProgressBar = ({
  progress = 0,
  height = 8,
  color = Colors.primary,
  backgroundColor = Colors.border,
  gradient = false,
  style,
}) => {
  const progressValue = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.container, { height, backgroundColor }, style]}>
      {gradient ? (
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.progress,
            {
              width: `${progressValue}%`,
              height,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.progress,
            {
              width: `${progressValue}%`,
              height,
              backgroundColor: color,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 9999,
  },
});

export default ProgressBar;
