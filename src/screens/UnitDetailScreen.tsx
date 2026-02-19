import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { useArmyStore } from '../../store/armyStore';
import { getUnitById, getDetachmentById } from '../utils/dataLoader';
import { StatBlock } from '../components/StatBlock';
import { WeaponProfileRow } from '../components/WeaponProfileRow';
import { ModelCountStepper } from '../components/ModelCountStepper';
import { SectionHeader } from '../components/SectionHeader';
import { calculateUnitPoints } from '../utils/points';
import type { RootStackParamList } from '../types/navigation';
import type { WargearOption } from '../types/data';

type Route = RouteProp<RootStackParamList, 'UnitDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'UnitDetail'>;

export function UnitDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { armyId, instanceId } = route.params;
  const { getArmy, updateUnit, setUnitEnhancement } = useArmyStore();

  const army = getArmy(armyId);
  const unit = army?.units.find((u) => u.instanceId === instanceId);
  const datasheet = unit ? getUnitById(unit.datasheetId) : undefined;

  if (!army || !unit || !datasheet) {
    return (
      <View style={styles.notFound}>
        <Text style={Typography.h2}>Unit not found</Text>
      </View>
    );
  }

  const detachment = army.detachmentId ? getDetachmentById(army.detachmentId) : undefined;
  const comp = datasheet.unitComposition;
  const points = calculateUnitPoints(unit, datasheet);

  function getSelectedChoice(option: WargearOption) {
    const selected = unit!.wargear.find((w) => w.optionId === option.id);
    if (selected) {
      return option.choices.find((c) => c.id === selected.selectedChoiceId) ?? option.choices[0];
    }
    return option.choices[0];
  }

  function handleEnhancement(enhancementId: string) {
    if (unit!.enhancementId === enhancementId) {
      setUnitEnhancement(armyId, instanceId, undefined);
    } else {
      setUnitEnhancement(armyId, instanceId, enhancementId);
    }
  }

  const isCharacter = datasheet.keywords.includes('CHARACTER');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.unitName}>{datasheet.name.toUpperCase()}</Text>
          <View style={styles.keywordRow}>
            {datasheet.keywords.map((kw) => (
              <View key={kw} style={styles.keyword}>
                <Text style={styles.keywordText}>{kw}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.ptsBox}>
          <Text style={styles.ptsValue}>{points}</Text>
          <Text style={styles.ptsLabel}>PTS</Text>
        </View>
      </View>

      {/* Fluff */}
      {datasheet.fluff && (
        <Text style={styles.fluff} numberOfLines={3}>
          {datasheet.fluff}
        </Text>
      )}

      {/* Stats */}
      <SectionHeader title="CHARACTERISTICS" />
      <StatBlock stats={datasheet.stats} />

      {/* Model Count */}
      {comp.minModels !== comp.maxModels && (
        <>
          <SectionHeader title="MODEL COUNT" />
          <View style={styles.stepperContainer}>
            <ModelCountStepper
              value={unit.modelCount}
              min={comp.minModels}
              max={comp.maxModels}
              onChange={(count) => updateUnit(armyId, instanceId, { modelCount: count })}
            />
            <Text style={styles.stepperHint}>
              {comp.minModels}–{comp.maxModels} models
              {comp.pointsPerAdditionalModel
                ? ` · +${comp.pointsPerAdditionalModel}pts each above ${comp.additionalModelMin}`
                : ''}
            </Text>
          </View>
        </>
      )}

      {/* Weapons */}
      <SectionHeader title="WEAPONS" />
      <View style={styles.weaponsHeader}>
        <Text style={styles.colLabel}>NAME</Text>
        <Text style={[styles.colLabel, styles.colRight]}>RNG</Text>
        <Text style={[styles.colLabel, styles.colRight]}>A</Text>
        <Text style={[styles.colLabel, styles.colRight]}>BS/WS</Text>
        <Text style={[styles.colLabel, styles.colRight]}>S</Text>
        <Text style={[styles.colLabel, styles.colRight]}>AP</Text>
        <Text style={[styles.colLabel, styles.colRight]}>D</Text>
      </View>
      {datasheet.baseWeapons.map((w) => (
        <WeaponProfileRow key={w.id} weapon={w} />
      ))}

      {/* Wargear Options */}
      {datasheet.wargearOptions.length > 0 && (
        <>
          <SectionHeader title="WARGEAR OPTIONS" />
          {datasheet.wargearOptions.map((option) => {
            const current = getSelectedChoice(option);
            return (
              <View key={option.id} style={styles.wargearOption}>
                <Text style={styles.wargearOptionText}>{option.replacementText}</Text>
                <TouchableOpacity
                  style={styles.wargearSelector}
                  onPress={() =>
                    navigation.navigate('WargearPicker', {
                      armyId,
                      instanceId,
                      optionId: option.id,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <View>
                    <Text style={styles.wargearScopeLabel}>
                      {typeof option.modelScope === 'number'
                        ? `Up to ${option.modelScope} model(s)`
                        : option.modelScope === 'one'
                        ? '1 model'
                        : 'All models'}
                    </Text>
                    <Text style={styles.wargearCurrentName}>{current.name}</Text>
                  </View>
                  <Text style={styles.wargearChangeText}>CHANGE ›</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </>
      )}

      {/* Abilities */}
      {datasheet.abilities.length > 0 && (
        <>
          <SectionHeader title="ABILITIES" />
          {datasheet.abilities.map((ability) => (
            <View key={ability.id} style={styles.ability}>
              <Text style={styles.abilityName}>{ability.name}</Text>
              <Text style={styles.abilityDesc}>{ability.description}</Text>
            </View>
          ))}
        </>
      )}

      {/* Enhancements (CHARACTER only, when detachment selected) */}
      {isCharacter && detachment && (
        <>
          <SectionHeader title="ENHANCEMENTS" />
          {detachment.enhancements.map((e) => (
            <TouchableOpacity
              key={e.id}
              style={[styles.enhancementRow, unit.enhancementId === e.id && styles.enhancementSelected]}
              onPress={() => handleEnhancement(e.id)}
              activeOpacity={0.8}
            >
              <View style={styles.enhancementLeft}>
                <Text style={styles.enhancementName}>{e.name}</Text>
                <Text style={styles.enhancementDesc} numberOfLines={2}>
                  {e.description}
                </Text>
              </View>
              <View style={styles.enhancementRight}>
                <Text style={styles.enhancementCost}>{e.cost}pts</Text>
                {unit.enhancementId === e.id && (
                  <Text style={styles.enhancementCheck}>✓</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  unitName: {
    ...Typography.h2,
    flex: 1,
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
    minWidth: 56,
  },
  ptsValue: {
    color: Colors.orkGreen,
    fontWeight: '900',
    fontSize: 24,
  },
  ptsLabel: {
    color: Colors.orkGreen,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  fluff: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontStyle: 'italic',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    lineHeight: 20,
  },
  stepperContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  stepperHint: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  weaponsHeader: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surfaceAlt,
  },
  colLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    flex: 2,
  },
  colRight: {
    flex: 1,
    textAlign: 'right',
  },
  wargearOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  wargearOptionText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  wargearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  wargearScopeLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  wargearCurrentName: {
    ...Typography.body,
    fontWeight: '700',
    fontSize: 14,
  },
  wargearChangeText: {
    marginLeft: 'auto',
    color: Colors.orkGreen,
    fontWeight: '700',
    fontSize: 12,
  },
  ability: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  abilityName: {
    color: Colors.brass,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 2,
  },
  abilityDesc: {
    ...Typography.bodySmall,
    lineHeight: 20,
  },
  enhancementRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  enhancementSelected: {
    borderLeftColor: Colors.orkGreen,
    backgroundColor: Colors.orkGreenDark + '22',
  },
  enhancementLeft: {
    flex: 1,
  },
  enhancementRight: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
  enhancementName: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  enhancementDesc: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  enhancementCost: {
    color: Colors.orkGreen,
    fontWeight: '800',
    fontSize: 13,
  },
  enhancementCheck: {
    color: Colors.orkGreen,
    fontWeight: '900',
    fontSize: 18,
    marginTop: 2,
  },
});
