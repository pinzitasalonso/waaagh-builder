import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { getAllDetachments } from '../utils/dataLoader';
import { useArmyStore } from '../../store/armyStore';
import type { RootStackParamList } from '../types/navigation';
import type { Detachment } from '../types/data';

type Route = RouteProp<RootStackParamList, 'DetachmentPicker'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'DetachmentPicker'>;

export function DetachmentPickerScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { armyId } = route.params;
  const { getArmy, setDetachment } = useArmyStore();

  const army = getArmy(armyId);
  const detachments = getAllDetachments();

  function handlePick(detachment: Detachment) {
    setDetachment(armyId, detachment.id);
    navigation.goBack();
  }

  function renderItem({ item }: { item: Detachment }) {
    const isSelected = army?.detachmentId === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => handlePick(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name.toUpperCase()}</Text>
          {isSelected && <Text style={styles.selectedBadge}>✓ SELECTED</Text>}
        </View>

        <View style={styles.ruleBox}>
          <Text style={styles.ruleBoxLabel}>{item.detachmentRule.name}</Text>
          <Text style={styles.ruleBoxText} numberOfLines={3}>
            {item.detachmentRule.description}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.infoBtn}
            onPress={() => navigation.navigate('DetachmentInfo', { detachmentId: item.id })}
          >
            <Text style={styles.infoBtnText}>VIEW FULL RULES ›</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={detachments}
        keyExtractor={(d) => d.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Spacing.md,
  },
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    ...Typography.h3,
    flex: 1,
  },
  selectedBadge: {
    color: Colors.orkGreen,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  ruleBox: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.brass,
  },
  ruleBoxLabel: {
    color: Colors.brass,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  ruleBoxText: {
    ...Typography.bodySmall,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  infoBtn: {
    paddingVertical: Spacing.xs,
  },
  infoBtnText: {
    color: Colors.orkGreen,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
