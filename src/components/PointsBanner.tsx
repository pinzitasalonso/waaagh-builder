import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../theme';

interface PointsBannerProps {
  current: number;
  max: number;
}

export function PointsBanner({ current, max }: PointsBannerProps) {
  const pct = max > 0 ? Math.min(current / max, 1) : 0;
  const isOver = current > max;

  let barColor = Colors.pointsGood;
  if (isOver) barColor = Colors.pointsDanger;
  else if (pct >= 0.8) barColor = Colors.pointsWarning;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>POINTS</Text>
        <Text style={[styles.value, isOver && styles.valueOver]}>
          {current}
          <Text style={styles.max}>/{max}</Text>
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.bar,
            { width: `${Math.min(pct * 100, 100)}%`, backgroundColor: barColor },
            isOver && styles.barOver,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  label: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.orkGreen,
    letterSpacing: 0.5,
  },
  valueOver: {
    color: Colors.danger,
  },
  max: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  track: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 2,
  },
  barOver: {
    width: '100%',
  },
});
