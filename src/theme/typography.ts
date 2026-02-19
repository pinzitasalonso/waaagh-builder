import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  h2: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  h3: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stat: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  points: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.orkGreen,
    letterSpacing: 1,
  },
  monospace: {
    fontSize: 13,
    fontFamily: 'Courier',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});
