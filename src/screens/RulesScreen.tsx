import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { getAllDetachments } from '../utils/dataLoader';
import type { RootStackParamList } from '../types/navigation';
import type { Detachment } from '../types/data';

type RulesNav = NativeStackNavigationProp<RootStackParamList>;

export function RulesScreen() {
  const navigation = useNavigation<RulesNav>();
  const detachments = getAllDetachments();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[Typography.h1, styles.pageTitle]}>DETACHMENTS</Text>
      <Text style={[Typography.bodySmall, styles.pageSubtitle]}>
        10TH EDITION ORK DETACHMENT RULES
      </Text>

      {detachments.map((d) => (
        <DetachmentSummaryCard
          key={d.id}
          detachment={d}
          onPress={() => navigation.navigate('DetachmentInfo', { detachmentId: d.id })}
        />
      ))}
    </ScrollView>
  );
}

function DetachmentSummaryCard({
  detachment,
  onPress,
}: {
  detachment: Detachment;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{detachment.name.toUpperCase()}</Text>
        <Text style={styles.cardArrow}>›</Text>
      </View>
      <Text style={styles.cardRule}>
        <Text style={styles.ruleLabel}>Rule: </Text>
        {detachment.detachmentRule.name}
      </Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {detachment.description}
      </Text>
      <View style={styles.cardMeta}>
        <Text style={styles.metaChip}>{detachment.enhancements.length} Enhancements</Text>
        <Text style={styles.metaChip}>{detachment.stratagems.length} Stratagems</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  pageTitle: {
    marginBottom: Spacing.xs,
  },
  pageSubtitle: {
    color: Colors.brass,
    letterSpacing: 1,
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.brass,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    ...Typography.h3,
    flex: 1,
  },
  cardArrow: {
    color: Colors.orkGreen,
    fontSize: 24,
    fontWeight: '300',
  },
  cardRule: {
    ...Typography.bodySmall,
    marginBottom: Spacing.xs,
  },
  ruleLabel: {
    color: Colors.brass,
    fontWeight: '700',
  },
  cardDesc: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  metaChip: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.orkGreen,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
