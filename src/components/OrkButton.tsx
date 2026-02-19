import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Spacing, Radius } from '../theme';

interface OrkButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function OrkButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: OrkButtonProps) {
  const containerStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyle: TextStyle[] = [styles.text, styles[`text_${variant}`], styles[`textSize_${size}`]];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'ghost' ? Colors.orkGreen : Colors.background}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  primary: {
    backgroundColor: Colors.orkGreen,
    borderColor: Colors.orkGreenLight,
  },
  danger: {
    backgroundColor: Colors.danger,
    borderColor: '#FF5555',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: Colors.orkGreen,
  },
  disabled: {
    opacity: 0.4,
  },
  size_sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minHeight: 32,
  },
  size_md: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minHeight: 44,
  },
  size_lg: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },
  text: {
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  text_primary: {
    color: Colors.background,
  },
  text_danger: {
    color: '#FFF',
  },
  text_ghost: {
    color: Colors.orkGreen,
  },
  textSize_sm: { fontSize: 12 },
  textSize_md: { fontSize: 14 },
  textSize_lg: { fontSize: 16 },
});
