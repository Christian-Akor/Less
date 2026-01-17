import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  icon = null,
  style,
  textStyle 
}) => {
  const sizeStyles = {
    small: { paddingVertical: 8, paddingHorizontal: 16 },
    medium: { paddingVertical: 12, paddingHorizontal: 24 },
    large: { paddingVertical: 16, paddingHorizontal: 32 },
  };

  const textSizeStyles = {
    small: { fontSize: 14 },
    medium: { fontSize: 16 },
    large: { fontSize: 18 },
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button, sizeStyles[size], style];
    
    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }

    switch (variant) {
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'ghost':
        baseStyle.push(styles.ghost);
        break;
      case 'danger':
        baseStyle.push(styles.danger);
        break;
      case 'secondary':
        baseStyle.push(styles.secondary);
        break;
      default:
        break;
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, textSizeStyles[size], textStyle];

    switch (variant) {
      case 'outline':
        baseStyle.push(styles.outlineText);
        break;
      case 'ghost':
        baseStyle.push(styles.ghostText);
        break;
      case 'danger':
        baseStyle.push(styles.dangerText);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryText);
        break;
      default:
        break;
    }

    return baseStyle;
  };

  const renderContent = () => (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.surface : Colors.primary} />
      ) : (
        <>
          {icon && <Text style={[getTextStyle(), styles.icon]}>{icon}</Text>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </View>
  );

  if (variant === 'primary' && !disabled && !loading) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={style}>
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, sizeStyles[size], styles.gradient]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={getButtonStyle()} 
      onPress={onPress} 
      disabled={disabled || loading}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    color: Colors.surface,
  },
  icon: {
    marginRight: 8,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  secondaryText: {
    color: Colors.surface,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: Colors.primary,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
  dangerText: {
    color: Colors.surface,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
