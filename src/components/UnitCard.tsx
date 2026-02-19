import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { getUnitById } from '../utils/dataLoader';
import type { ArmyUnit } from '../types/army';

interface UnitCardProps {
  unit: ArmyUnit;
  onPress: () => void;
  onDelete: () => void;
}

export function UnitCard({ unit, onPress, onDelete }: UnitCardProps) {
  const swipeableRef = useRef<Swipeable>(null);
  const datasheet = getUnitById(unit.datasheetId);

  if (!datasheet) return null;

  function handleDelete() {
    swipeableRef.current?.close();
    onDelete();
  }

  function renderRightActions(
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) {
    const opacity = dragX.interpolate({
      inputRange: [-80, -40],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.deleteAction, { opacity }]}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteIcon}>🗑</Text>
          <Text style={styles.deleteText}>DELETE</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const isEpicHero = datasheet.isEpicHero;

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.left}>
          {isEpicHero && <View style={styles.epicBadge}><Text style={styles.epicText}>EPIC HERO</Text></View>}
          <Text style={styles.name}>
            {unit.customName ?? datasheet.name}
          </Text>
          {unit.customName && (
            <Text style={styles.datasheetName}>{datasheet.name}</Text>
          )}
          <Text style={styles.meta}>
            {datasheet.unitComposition.minModels !== datasheet.unitComposition.maxModels
              ? `${unit.modelCount} models`
              : `${datasheet.unitComposition.minModels} model`}
            {' · '}
            {datasheet.keywords.filter((k) => ['INFANTRY', 'VEHICLE', 'MOUNTED', 'BATTLELINE'].includes(k)).join(', ')}
          </Text>
          {unit.enhancementId && (
            <Text style={styles.enhancementLabel}>⭐ Enhancement</Text>
          )}
        </View>
        <View style={styles.right}>
          <Text style={styles.points}>{unit.computedPoints}</Text>
          <Text style={styles.ptsLabel}>pts</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  left: {
    flex: 1,
  },
  epicBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.brass + '33',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.brass + '55',
  },
  epicText: {
    color: Colors.brass,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  name: {
    ...Typography.h3,
    fontSize: 15,
  },
  datasheetName: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  meta: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  enhancementLabel: {
    fontSize: 11,
    color: Colors.brass,
    fontWeight: '600',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
  points: {
    color: Colors.orkGreen,
    fontWeight: '900',
    fontSize: 22,
  },
  ptsLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  chevron: {
    color: Colors.textMuted,
    fontSize: 18,
    marginTop: 2,
  },
  deleteAction: {
    justifyContent: 'center',
    marginVertical: Spacing.xs,
    marginRight: Spacing.md,
  },
  deleteButton: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    minWidth: 70,
    justifyContent: 'center',
    height: '100%',
  },
  deleteIcon: {
    fontSize: 18,
  },
  deleteText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 2,
  },
});
