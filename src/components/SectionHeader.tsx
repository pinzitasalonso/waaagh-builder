import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../theme';

interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.accent} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.background,
  },
  accent: {
    width: 4,
    height: 16,
    backgroundColor: Colors.brass,
    borderRadius: 2,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.brass,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
