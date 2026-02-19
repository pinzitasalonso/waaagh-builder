import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius } from '../theme';

interface ModelCountStepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function ModelCountStepper({ value, min, max, onChange }: ModelCountStepperProps) {
  function decrement() {
    if (value > min) onChange(value - 1);
  }

  function increment() {
    if (value < max) onChange(value + 1);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, value <= min && styles.btnDisabled]}
        onPress={decrement}
        disabled={value <= min}
        activeOpacity={0.7}
      >
        <Text style={styles.btnText}>−</Text>
      </TouchableOpacity>

      <View style={styles.valueBox}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.valueLabel}>MODELS</Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, value >= max && styles.btnDisabled]}
        onPress={increment}
        disabled={value >= max}
        activeOpacity={0.7}
      >
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  btn: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.orkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.orkGreenLight,
  },
  btnDisabled: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.border,
    opacity: 0.5,
  },
  btnText: {
    color: Colors.background,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  valueBox: {
    alignItems: 'center',
    minWidth: 72,
  },
  value: {
    color: Colors.textPrimary,
    fontSize: 36,
    fontWeight: '900',
  },
  valueLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
