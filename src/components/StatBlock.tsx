import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../theme';
import type { UnitStats } from '../types/data';

interface StatBlockProps {
  stats: UnitStats;
}

export function StatBlock({ stats }: StatBlockProps) {
  const entries: { label: string; value: string }[] = [
    { label: 'M', value: stats.M },
    { label: 'T', value: String(stats.T) },
    { label: 'SV', value: stats.Sv },
    { label: 'W', value: String(stats.W) },
    { label: 'LD', value: stats.Ld },
    { label: 'OC', value: String(stats.OC) },
  ];

  if (stats.invulSave) {
    entries.push({ label: 'INV', value: stats.invulSave });
  }

  return (
    <View style={styles.container}>
      {entries.map((entry, idx) => (
        <View
          key={entry.label}
          style={[styles.cell, idx < entries.length - 1 && styles.cellBorder]}
        >
          <Text style={styles.value}>{entry.value}</Text>
          <Text style={styles.label}>{entry.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#111',
    marginHorizontal: Spacing.md,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  cellBorder: {
    borderRightWidth: 1,
    borderRightColor: '#2A2A2A',
  },
  value: {
    color: Colors.textPrimary,
    fontWeight: '800',
    fontSize: 15,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 1,
  },
});
