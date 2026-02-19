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
import { useArmyStore } from '../../store/armyStore';
import { getUnitById } from '../utils/dataLoader';
import { WeaponProfileRow } from '../components/WeaponProfileRow';
import type { RootStackParamList } from '../types/navigation';
import type { WeaponProfile, WargearOption } from '../types/data';
import type { SelectedWargear } from '../types/army';

type Route = RouteProp<RootStackParamList, 'WargearPicker'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'WargearPicker'>;

export function WargearPickerScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { armyId, instanceId, optionId } = route.params;
  const { getArmy, updateUnit } = useArmyStore();

  const army = getArmy(armyId);
  const unit = army?.units.find((u) => u.instanceId === instanceId);
  const datasheet = unit ? getUnitById(unit.datasheetId) : undefined;
  const option: WargearOption | undefined = datasheet?.wargearOptions.find(
    (o) => o.id === optionId
  );

  if (!army || !unit || !datasheet || !option) {
    return (
      <View style={styles.notFound}>
        <Text style={Typography.h2}>Option not found</Text>
      </View>
    );
  }

  const currentSelected = unit.wargear.find((w) => w.optionId === optionId);
  const currentChoiceId = currentSelected?.selectedChoiceId ?? option.choices[0]?.id;

  function handleSelect(choice: WeaponProfile) {
    const isDefault = choice.id === option!.choices[0]?.id;
    let newWargear: SelectedWargear[];

    if (isDefault) {
      newWargear = unit!.wargear.filter((w) => w.optionId !== optionId);
    } else {
      const existing = unit!.wargear.find((w) => w.optionId === optionId);
      if (existing) {
        newWargear = unit!.wargear.map((w) =>
          w.optionId === optionId ? { ...w, selectedChoiceId: choice.id } : w
        );
      } else {
        newWargear = [...unit!.wargear, { optionId, selectedChoiceId: choice.id }];
      }
    }

    updateUnit(armyId, instanceId, { wargear: newWargear });
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.optionTitle}>{option.name.toUpperCase()}</Text>
        <Text style={styles.optionDesc}>{option.replacementText}</Text>
        <Text style={styles.scopeText}>
          Scope:{' '}
          {typeof option.modelScope === 'number'
            ? `up to ${option.modelScope} models`
            : option.modelScope === 'one'
            ? '1 model'
            : 'all models'}
        </Text>
      </View>

      {/* Column headers */}
      <View style={styles.colHeaders}>
        <Text style={[styles.colLabel, { flex: 2 }]}>WEAPON</Text>
        <Text style={[styles.colLabel, styles.colRight]}>RNG</Text>
        <Text style={[styles.colLabel, styles.colRight]}>A</Text>
        <Text style={[styles.colLabel, styles.colRight]}>SK</Text>
        <Text style={[styles.colLabel, styles.colRight]}>S</Text>
        <Text style={[styles.colLabel, styles.colRight]}>AP</Text>
        <Text style={[styles.colLabel, styles.colRight]}>D</Text>
      </View>

      <FlatList
        data={option.choices}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => {
          const isSelected = item.id === currentChoiceId;
          return (
            <TouchableOpacity
              style={[styles.choiceRow, isSelected && styles.choiceRowSelected]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.8}
            >
              <View style={styles.choiceCheck}>
                {isSelected ? (
                  <View style={styles.checkFilled} />
                ) : (
                  <View style={styles.checkEmpty} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <WeaponProfileRow weapon={item} compact />
                {item.abilities && item.abilities.length > 0 && (
                  <Text style={styles.abilities}>
                    {item.abilities.filter((a) => a !== 'Default loadout' && a !== 'Default').join(', ')}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: Spacing.xl }}
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
  header: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionTitle: {
    ...Typography.h3,
    marginBottom: 2,
  },
  optionDesc: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  scopeText: {
    fontSize: 11,
    color: Colors.brass,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  colHeaders: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md + 32,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  colLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  colRight: {
    flex: 1,
    textAlign: 'right',
  },
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  choiceRowSelected: {
    backgroundColor: Colors.orkGreenDark + '33',
    borderLeftWidth: 3,
    borderLeftColor: Colors.orkGreen,
  },
  choiceCheck: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkFilled: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.orkGreen,
    borderWidth: 2,
    borderColor: Colors.orkGreenLight,
  },
  checkEmpty: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  abilities: {
    fontSize: 10,
    color: Colors.brass,
    fontStyle: 'italic',
    paddingBottom: Spacing.xs,
  },
});
