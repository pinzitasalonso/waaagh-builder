import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';
import type { ValidationResult, ValidationSeverity } from '../types/army';

interface ValidationSheetProps {
  visible: boolean;
  results: ValidationResult[];
  onClose: () => void;
}

const SEVERITY_COLORS: Record<ValidationSeverity, string> = {
  error: Colors.danger,
  warning: Colors.warning,
  info: Colors.info,
};

const SEVERITY_ICONS: Record<ValidationSeverity, string> = {
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const SEVERITY_ORDER: ValidationSeverity[] = ['error', 'warning', 'info'];

export function ValidationSheet({ visible, results, onClose }: ValidationSheetProps) {
  const translateY = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 400,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const sorted = [...results].sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  );

  const errorCount = results.filter((r) => r.severity === 'error').length;
  const warnCount = results.filter((r) => r.severity === 'warning').length;
  const infoCount = results.filter((r) => r.severity === 'info').length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
              {/* Handle */}
              <View style={styles.handle} />

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>ARMY VALIDATION</Text>
                <View style={styles.badgeRow}>
                  {errorCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: Colors.danger + '33' }]}>
                      <Text style={[styles.badgeText, { color: Colors.danger }]}>
                        {errorCount} Error{errorCount !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}
                  {warnCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: Colors.warning + '33' }]}>
                      <Text style={[styles.badgeText, { color: Colors.warning }]}>
                        {warnCount} Warning{warnCount !== 1 ? 's' : ''}
                      </Text>
                    </View>
                  )}
                  {infoCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: Colors.info + '33' }]}>
                      <Text style={[styles.badgeText, { color: Colors.info }]}>
                        {infoCount} Info
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                {sorted.map((result, idx) => {
                  const color = SEVERITY_COLORS[result.severity];
                  const icon = SEVERITY_ICONS[result.severity];
                  return (
                    <View key={idx} style={[styles.item, { borderLeftColor: color }]}>
                      <Text style={[styles.itemIcon, { color }]}>{icon}</Text>
                      <Text style={styles.itemText}>{result.message}</Text>
                    </View>
                  );
                })}

                {results.length === 0 && (
                  <View style={styles.allGood}>
                    <Text style={styles.allGoodIcon}>✓</Text>
                    <Text style={styles.allGoodText}>ALL GOOD, BOSS!</Text>
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeBtnText}>CLOSE</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '70%',
    paddingBottom: Spacing.xxl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
  },
  itemIcon: {
    fontWeight: '900',
    fontSize: 14,
    marginRight: Spacing.sm,
    marginTop: 1,
    width: 16,
    textAlign: 'center',
  },
  itemText: {
    ...Typography.bodySmall,
    flex: 1,
    lineHeight: 20,
  },
  allGood: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  allGoodIcon: {
    color: Colors.orkGreen,
    fontSize: 48,
    fontWeight: '900',
  },
  allGoodText: {
    ...Typography.h2,
    color: Colors.orkGreen,
    marginTop: Spacing.sm,
  },
  closeBtn: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeBtnText: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
