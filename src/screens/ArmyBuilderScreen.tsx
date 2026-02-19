import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { useArmyStore } from '../../store/armyStore';
import { getUnitById, getDetachmentById } from '../utils/dataLoader';
import { calculateArmyPoints } from '../utils/points';
import { validateArmy } from '../utils/validation';
import { PointsBanner } from '../components/PointsBanner';
import { SectionHeader } from '../components/SectionHeader';
import { UnitCard } from '../components/UnitCard';
import { ValidationSheet } from '../components/ValidationSheet';
import type { RootStackParamList } from '../types/navigation';
import type { ArmyUnit, ValidationResult } from '../types/army';

type ArmyBuilderRoute = RouteProp<RootStackParamList, 'ArmyBuilder'>;
type ArmyBuilderNav = NativeStackNavigationProp<RootStackParamList, 'ArmyBuilder'>;

export function ArmyBuilderScreen() {
  const route = useRoute<ArmyBuilderRoute>();
  const navigation = useNavigation<ArmyBuilderNav>();
  const { armyId } = route.params;
  const { getArmy, removeUnit } = useArmyStore();
  const [showValidation, setShowValidation] = useState(false);

  const army = getArmy(armyId);

  if (!army) {
    return (
      <View style={styles.notFound}>
        <Text style={Typography.h2}>Army not found</Text>
      </View>
    );
  }

  const detachment = army.detachmentId ? getDetachmentById(army.detachmentId) : undefined;
  const totalPoints = calculateArmyPoints(army);
  const validationResults: ValidationResult[] = validateArmy(army);
  const errorCount = validationResults.filter((r) => r.severity === 'error').length;
  const warnCount = validationResults.filter((r) => r.severity === 'warning').length;

  const sections = [
    {
      title: 'UNITS',
      data: army.units,
    },
  ];

  function handleRemoveUnit(unit: ArmyUnit) {
    const datasheet = getUnitById(unit.datasheetId);
    Alert.alert(
      'Remove Unit?',
      `Remove ${unit.customName ?? datasheet?.name ?? 'unit'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeUnit(armyId, unit.instanceId),
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <PointsBanner current={totalPoints} max={army.pointsLimit} />

      {/* Detachment Banner */}
      <TouchableOpacity
        style={styles.detachmentBanner}
        onPress={() => navigation.navigate('DetachmentPicker', { armyId })}
        activeOpacity={0.8}
      >
        {detachment ? (
          <>
            <View>
              <Text style={styles.detachmentLabel}>DETACHMENT</Text>
              <Text style={styles.detachmentName}>{detachment.name}</Text>
            </View>
            <Text style={styles.detachmentChange}>CHANGE ›</Text>
          </>
        ) : (
          <>
            <Text style={styles.detachmentEmpty}>TAP TO PICK DETACHMENT</Text>
            <Text style={styles.detachmentArrow}>›</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Validation Banner */}
      {(errorCount > 0 || warnCount > 0) && (
        <TouchableOpacity
          style={[
            styles.validationBanner,
            errorCount > 0 ? styles.validationError : styles.validationWarning,
          ]}
          onPress={() => setShowValidation(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.validationText}>
            {errorCount > 0
              ? `${errorCount} error${errorCount !== 1 ? 's' : ''}`
              : `${warnCount} warning${warnCount !== 1 ? 's' : ''}`}
            {errorCount > 0 && warnCount > 0 ? `, ${warnCount} warning${warnCount !== 1 ? 's' : ''}` : ''}
            {' · TAP TO VIEW'}
          </Text>
        </TouchableOpacity>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.instanceId}
        renderSectionHeader={({ section: { title } }) => (
          <SectionHeader title={title} />
        )}
        renderItem={({ item }) => (
          <UnitCard
            unit={item}
            onPress={() =>
              navigation.navigate('UnitDetail', { armyId, instanceId: item.instanceId })
            }
            onDelete={() => handleRemoveUnit(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyUnits}>
            <Text style={styles.emptyText}>NO UNITS YET</Text>
            <Text style={styles.emptySubtext}>Add some boyz!</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
      />

      {/* Add Units FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('UnitPicker', { armyId })}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+ ADD MORE BOYZ!</Text>
      </TouchableOpacity>

      {/* Export button */}
      <TouchableOpacity
        style={styles.exportBtn}
        onPress={() => navigation.navigate('ArmyExport', { armyId })}
        activeOpacity={0.8}
      >
        <Text style={styles.exportBtnText}>EXPORT</Text>
      </TouchableOpacity>

      <ValidationSheet
        visible={showValidation}
        results={validationResults}
        onClose={() => setShowValidation(false)}
      />
    </View>
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
  detachmentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detachmentLabel: {
    ...Typography.label,
    fontSize: 10,
    color: Colors.brass,
  },
  detachmentName: {
    ...Typography.h3,
    fontSize: 15,
  },
  detachmentChange: {
    marginLeft: 'auto',
    color: Colors.orkGreen,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  detachmentEmpty: {
    flex: 1,
    color: Colors.textMuted,
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 1,
  },
  detachmentArrow: {
    color: Colors.orkGreen,
    fontSize: 20,
  },
  validationBanner: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  validationError: {
    backgroundColor: Colors.danger,
  },
  validationWarning: {
    backgroundColor: Colors.warning,
  },
  validationText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  list: {
    paddingBottom: 120,
  },
  emptyUnits: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  emptyText: {
    ...Typography.h2,
    color: Colors.textMuted,
  },
  emptySubtext: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.orkGreen,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.orkGreenLight,
    shadowColor: Colors.orkGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: Colors.background,
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  exportBtn: {
    position: 'absolute',
    bottom: Spacing.xl + 60,
    right: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exportBtnText: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 1,
  },
});
