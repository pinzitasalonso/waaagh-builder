import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { useArmyStore } from '../../store/armyStore';
import { getUnitById, getDetachmentById } from '../utils/dataLoader';
import { calculateArmyPoints } from '../utils/points';
import type { RootStackParamList } from '../types/navigation';
import type { ArmyUnit } from '../types/army';
import type { WargearOption } from '../types/data';

type Route = RouteProp<RootStackParamList, 'ArmyExport'>;

export function ArmyExportScreen() {
  const route = useRoute<Route>();
  const { armyId } = route.params;
  const { getArmy } = useArmyStore();
  const [copied, setCopied] = useState(false);

  const army = getArmy(armyId);

  if (!army) {
    return (
      <View style={styles.notFound}>
        <Text style={Typography.h2}>Army not found</Text>
      </View>
    );
  }

  const totalPoints = calculateArmyPoints(army);
  const detachment = army.detachmentId ? getDetachmentById(army.detachmentId) : undefined;
  const exportText = buildExportText(army, totalPoints, detachment?.name);

  async function handleCopy() {
    await Clipboard.setStringAsync(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>{army.name}</Text>
        <TouchableOpacity
          style={[styles.copyBtn, copied && styles.copyBtnSuccess]}
          onPress={handleCopy}
          activeOpacity={0.8}
        >
          <Text style={styles.copyBtnText}>{copied ? '✓ COPIED!' : 'COPY'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.exportText}>{exportText}</Text>
      </ScrollView>
    </View>
  );
}

function buildExportText(
  army: ReturnType<ReturnType<typeof useArmyStore>['getArmy']>,
  totalPoints: number,
  detachmentName?: string
): string {
  if (!army) return '';
  const lines: string[] = [];

  lines.push(`== ${army.name} ==`);
  lines.push(`Detachment: ${detachmentName ?? 'None'}`);
  lines.push(`Points: ${totalPoints}/${army.pointsLimit}`);
  lines.push('');

  army.units.forEach((unit) => {
    const datasheet = getUnitById(unit.datasheetId);
    if (!datasheet) return;

    const name = unit.customName
      ? `${unit.customName} (${datasheet.name})`
      : datasheet.name;

    lines.push(`+ ${name} [${unit.computedPoints}pts]`);

    if (datasheet.unitComposition.minModels !== datasheet.unitComposition.maxModels) {
      lines.push(`  Models: ${unit.modelCount}`);
    }

    // Wargear
    datasheet.wargearOptions.forEach((option) => {
      const selected = unit.wargear.find((w) => w.optionId === option.id);
      if (selected) {
        const choice = option.choices.find((c) => c.id === selected.selectedChoiceId);
        if (choice && choice.id !== option.choices[0]?.id) {
          lines.push(`  ${option.name}: ${choice.name}`);
        }
      }
    });

    // Enhancement
    if (unit.enhancementId) {
      const detachment = army.detachmentId ? getDetachmentById(army.detachmentId) : undefined;
      const enhancement = detachment?.enhancements.find((e) => e.id === unit.enhancementId);
      if (enhancement) {
        lines.push(`  Enhancement: ${enhancement.name} [${enhancement.cost}pts]`);
      }
    }

    lines.push('');
  });

  lines.push(`TOTAL: ${totalPoints}/${army.pointsLimit}pts`);

  return lines.join('\n');
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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  toolbarTitle: {
    ...Typography.h3,
    flex: 1,
    fontSize: 15,
  },
  copyBtn: {
    backgroundColor: Colors.orkGreen,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.orkGreenLight,
  },
  copyBtnSuccess: {
    backgroundColor: Colors.brass,
    borderColor: Colors.brass,
  },
  copyBtnText: {
    color: Colors.background,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  exportText: {
    ...Typography.monospace,
    lineHeight: 22,
  },
});
