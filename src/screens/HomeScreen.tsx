import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { OrkButton } from '../components/OrkButton';
import { useArmyStore } from '../../store/armyStore';
import type { RootStackParamList } from '../types/navigation';
import type { ArmyList } from '../types/army';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const POINTS_OPTIONS = [500, 1000, 1500, 2000, 2500];

export function HomeScreen() {
  const navigation = useNavigation<HomeNav>();
  const { armies, createArmy, deleteArmy } = useArmyStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newArmyName, setNewArmyName] = useState('');
  const [pointsLimit, setPointsLimit] = useState(2000);

  function handleCreate() {
    const name = newArmyName.trim() || 'Da WAAAGH!';
    const id = createArmy(name, pointsLimit);
    setShowCreateModal(false);
    setNewArmyName('');
    setPointsLimit(2000);
    navigation.navigate('ArmyBuilder', { armyId: id });
  }

  function handleDelete(army: ArmyList) {
    Alert.alert(
      "KRUMP IT?",
      `Delete "${army.name}"? Dis can't be undone!`,
      [
        { text: "No, Keep It", style: 'cancel' },
        { text: "KRUMP IT!", style: 'destructive', onPress: () => deleteArmy(army.id) },
      ]
    );
  }

  function renderArmy({ item }: { item: ArmyList }) {
    const totalPoints = item.units.reduce((s, u) => s + u.computedPoints, 0);
    return (
      <TouchableOpacity
        style={styles.armyCard}
        onPress={() => navigation.navigate('ArmyBuilder', { armyId: item.id })}
        activeOpacity={0.75}
      >
        <View style={styles.armyCardLeft}>
          <Text style={styles.armyName}>{item.name}</Text>
          <Text style={styles.armyMeta}>
            {totalPoints}/{item.pointsLimit} pts · {item.units.length} unit{item.units.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {armies.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>NO ARMYZ YET</Text>
          <Text style={styles.emptySubtitle}>Build yer first WAAAGH!</Text>
        </View>
      ) : (
        <FlatList
          data={armies}
          keyExtractor={(item) => item.id}
          renderItem={renderArmy}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+ NEW WAAAGH!</Text>
      </TouchableOpacity>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <Text style={[Typography.h2, { marginBottom: Spacing.md }]}>NEW WAAAGH!</Text>

            <Text style={styles.inputLabel}>ARMY NAME</Text>
            <TextInput
              style={styles.textInput}
              value={newArmyName}
              onChangeText={setNewArmyName}
              placeholder="Da WAAAGH!"
              placeholderTextColor={Colors.textMuted}
              autoFocus
              returnKeyType="done"
            />

            <Text style={[styles.inputLabel, { marginTop: Spacing.md }]}>POINTS LIMIT</Text>
            <View style={styles.pointsRow}>
              {POINTS_OPTIONS.map((pts) => (
                <TouchableOpacity
                  key={pts}
                  style={[styles.pointsChip, pointsLimit === pts && styles.pointsChipActive]}
                  onPress={() => setPointsLimit(pts)}
                >
                  <Text
                    style={[
                      styles.pointsChipText,
                      pointsLimit === pts && styles.pointsChipTextActive,
                    ]}
                  >
                    {pts}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <OrkButton
                title="Cancel"
                variant="ghost"
                onPress={() => setShowCreateModal(false)}
                style={{ flex: 1, marginRight: Spacing.sm }}
              />
              <OrkButton
                title="WAAAGH!"
                variant="primary"
                onPress={handleCreate}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    paddingBottom: 100,
  },
  separator: {
    height: Spacing.sm,
  },
  armyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.orkGreen,
  },
  armyCardLeft: {
    flex: 1,
  },
  armyName: {
    ...Typography.h3,
    fontSize: 16,
  },
  armyMeta: {
    ...Typography.bodySmall,
    marginTop: 2,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: Colors.textMuted,
    fontSize: 18,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.h1,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
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
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  inputLabel: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  textInput: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pointsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  pointsChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
  },
  pointsChipActive: {
    borderColor: Colors.orkGreen,
    backgroundColor: Colors.orkGreenDark,
  },
  pointsChipText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  pointsChipTextActive: {
    color: Colors.orkGreenLight,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: Spacing.md,
  },
});
