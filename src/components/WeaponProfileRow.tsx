import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../theme';
import type { WeaponProfile } from '../types/data';

interface WeaponProfileRowProps {
  weapon: WeaponProfile;
  compact?: boolean;
}

export function WeaponProfileRow({ weapon, compact = false }: WeaponProfileRowProps) {
  const apStr = weapon.ap === 0 ? '0' : String(weapon.ap);
  const rangeStr = weapon.type === 'Melee' ? 'Melee' : (weapon.range ?? '-');

  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      <Text style={[styles.name, { flex: 2 }]} numberOfLines={1}>
        {weapon.name}
      </Text>
      <Text style={[styles.cell, styles.right]}>{rangeStr}</Text>
      <Text style={[styles.cell, styles.right]}>{weapon.attacks}</Text>
      <Text style={[styles.cell, styles.right]}>{weapon.skill}</Text>
      <Text style={[styles.cell, styles.right]}>{weapon.strength}</Text>
      <Text style={[styles.cell, styles.right]}>{apStr}</Text>
      <Text style={[styles.cell, styles.right]}>{weapon.damage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowCompact: {
    paddingVertical: Spacing.xs + 2,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  cell: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  right: {
    textAlign: 'right',
  },
});
