import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';
import type { Detachment } from '../types/data';

interface DetachmentCardProps {
  detachment: Detachment;
  selected?: boolean;
  onPress?: () => void;
  onInfoPress?: () => void;
}

export function DetachmentCard({
  detachment,
  selected = false,
  onPress,
  onInfoPress,
}: DetachmentCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{detachment.name.toUpperCase()}</Text>
        {selected && <Text style={styles.selectedBadge}>✓</Text>}
      </View>

      <View style={styles.ruleBox}>
        <Text style={styles.ruleName}>{detachment.detachmentRule.name}</Text>
        <Text style={styles.ruleDesc} numberOfLines={2}>
          {detachment.detachmentRule.description}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          {detachment.enhancements.length} enhancements · {detachment.stratagems.length} stratagems
        </Text>
        {onInfoPress && (
          <TouchableOpacity onPress={onInfoPress}>
            <Text style={styles.infoLink}>FULL RULES ›</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  cardSelected: {
    borderColor: Colors.orkGreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  name: {
    ...Typography.h3,
    flex: 1,
  },
  selectedBadge: {
    color: Colors.orkGreen,
    fontWeight: '900',
    fontSize: 20,
  },
  ruleBox: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.brass,
  },
  ruleName: {
    color: Colors.brass,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  ruleDesc: {
    ...Typography.bodySmall,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 11,
  },
  infoLink: {
    color: Colors.orkGreen,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
