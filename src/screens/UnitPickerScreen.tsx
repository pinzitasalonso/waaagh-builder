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
import { getAllUnits } from '../utils/dataLoader';
import { useArmyStore } from '../../store/armyStore';
import type { RootStackParamList } from '../types/navigation';
import type { UnitDatasheet } from '../types/data';

type Route = RouteProp<RootStackParamList, 'UnitPicker'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'UnitPicker'>;

export function UnitPickerScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { armyId } = route.params;
  const { addUnit } = useArmyStore();

  const units = getAllUnits();

  function handleAdd(unit: UnitDatasheet) {
    addUnit(armyId, unit.id);
    navigation.goBack();
  }

  function renderUnit({ item }: { item: UnitDatasheet }) {
    const comp = item.unitComposition;
    const pts = comp.pointsPerUnit;
    const isMulti = comp.maxModels > comp.minModels;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleAdd(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardTop}>
          <View style={styles.cardLeft}>
            <Text style={styles.unitName}>{item.name.toUpperCase()}</Text>
            <View style={styles.keywordRow}>
              {item.keywords.slice(0, 4).map((kw) => (
                <View key={kw} style={styles.keyword}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.ptsBox}>
            <Text style={styles.ptsValue}>{pts}</Text>
            <Text style={styles.ptsLabel}>PTS</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <StatCell label="M" value={item.stats.M} />
          <StatCell label="T" value={String(item.stats.T)} />
          <StatCell label="SV" value={item.stats.Sv} />
          <StatCell label="W" value={String(item.stats.W)} />
          <StatCell label="LD" value={item.stats.Ld} />
          <StatCell label="OC" value={String(item.stats.OC)} />
        </View>

        <Text style={styles.composition}>
          {comp.minModels === comp.maxModels
            ? `${comp.minModels} model${comp.minModels !== 1 ? 's' : ''}`
            : `${comp.minModels}–${comp.maxModels} models`}
          {isMulti && comp.pointsPerAdditionalModel
            ? ` · +${comp.pointsPerAdditionalModel}pts/extra`
            : ''}
          {item.isEpicHero ? ' · EPIC HERO' : ''}
        </Text>

        <View style={styles.addRow}>
          <Text style={styles.addText}>+ ADD TO ARMY</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={units}
        keyExtractor={(u) => u.id}
        renderItem={renderUnit}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      />
    </View>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCell}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    paddingBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  cardLeft: {
    flex: 1,
  },
  unitName: {
    ...Typography.h3,
    fontSize: 16,
    marginBottom: Spacing.xs,
  },
  keywordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  keyword: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  keywordText: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  ptsBox: {
    alignItems: 'center',
    backgroundColor: Colors.orkGreenDark + '44',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginLeft: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.orkGreen + '55',
  },
  ptsValue: {
    color: Colors.orkGreen,
    fontWeight: '900',
    fontSize: 20,
  },
  ptsLabel: {
    color: Colors.orkGreen,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  statValue: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  composition: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  addRow: {
    alignItems: 'center',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addText: {
    color: Colors.orkGreen,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1.5,
  },
});
