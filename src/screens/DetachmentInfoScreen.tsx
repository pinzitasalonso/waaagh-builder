import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { getDetachmentById } from '../utils/dataLoader';
import type { RootStackParamList } from '../types/navigation';
import type { Stratagem, Enhancement } from '../types/data';

type Route = RouteProp<RootStackParamList, 'DetachmentInfo'>;

type Tab = 'rule' | 'enhancements' | 'stratagems';

export function DetachmentInfoScreen() {
  const route = useRoute<Route>();
  const { detachmentId } = route.params;
  const detachment = getDetachmentById(detachmentId);
  const [activeTab, setActiveTab] = useState<Tab>('rule');

  if (!detachment) {
    return (
      <View style={styles.notFound}>
        <Text style={Typography.h2}>Detachment not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {(['rule', 'enhancements', 'stratagems'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'rule' ? 'RULE' : tab === 'enhancements' ? 'ENHANCE' : 'STRATS'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'rule' && (
          <View>
            <Text style={styles.ruleTitle}>{detachment.detachmentRule.name.toUpperCase()}</Text>
            <Text style={styles.ruleBody}>{detachment.detachmentRule.description}</Text>
            <View style={styles.divider} />
            <Text style={[Typography.bodySmall, { color: Colors.textMuted, fontStyle: 'italic' }]}>
              {detachment.description}
            </Text>
          </View>
        )}

        {activeTab === 'enhancements' &&
          detachment.enhancements.map((e) => <EnhancementCard key={e.id} enhancement={e} />)}

        {activeTab === 'stratagems' &&
          detachment.stratagems.map((s) => <StratagemCard key={s.id} stratagem={s} />)}
      </ScrollView>
    </View>
  );
}

function EnhancementCard({ enhancement }: { enhancement: Enhancement }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{enhancement.name}</Text>
        <View style={styles.costBadge}>
          <Text style={styles.costText}>{enhancement.cost}pts</Text>
        </View>
      </View>
      <Text style={styles.cardBody}>{enhancement.description}</Text>
      {enhancement.keywords && enhancement.keywords.length > 0 && (
        <View style={styles.keywordRow}>
          {enhancement.keywords.map((kw) => (
            <View key={kw} style={styles.keyword}>
              <Text style={styles.keywordText}>{kw}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function StratagemCard({ stratagem }: { stratagem: Stratagem }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{stratagem.name}</Text>
          <View style={styles.stratagemMeta}>
            <Text style={styles.stratagemPhase}>{stratagem.phase.toUpperCase()}</Text>
            <Text style={styles.stratagemType}>{stratagem.type}</Text>
          </View>
        </View>
        <View style={[styles.costBadge, { backgroundColor: Colors.brass + '33' }]}>
          <Text style={[styles.costText, { color: Colors.brass }]}>
            {stratagem.cost}CP
          </Text>
        </View>
      </View>

      <View style={styles.stratagemSection}>
        <Text style={styles.stratagemLabel}>WHEN</Text>
        <Text style={styles.cardBody}>{stratagem.when}</Text>
      </View>
      <View style={styles.stratagemSection}>
        <Text style={styles.stratagemLabel}>TARGET</Text>
        <Text style={styles.cardBody}>{stratagem.target}</Text>
      </View>
      <View style={styles.stratagemSection}>
        <Text style={styles.stratagemLabel}>EFFECT</Text>
        <Text style={styles.cardBody}>{stratagem.effect}</Text>
      </View>
      {stratagem.restrictions && (
        <View style={[styles.stratagemSection, { borderTopWidth: 1, borderTopColor: Colors.border }]}>
          <Text style={[styles.cardBody, { color: Colors.warning, fontStyle: 'italic' }]}>
            {stratagem.restrictions}
          </Text>
        </View>
      )}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.orkGreen,
  },
  tabText: {
    ...Typography.label,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.orkGreen,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  ruleTitle: {
    ...Typography.h2,
    color: Colors.brass,
    marginBottom: Spacing.sm,
  },
  ruleBody: {
    ...Typography.body,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    ...Typography.h3,
    flex: 1,
    fontSize: 15,
  },
  costBadge: {
    backgroundColor: Colors.orkGreenDark + '55',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginLeft: Spacing.sm,
  },
  costText: {
    color: Colors.orkGreen,
    fontWeight: '800',
    fontSize: 13,
  },
  cardBody: {
    ...Typography.bodySmall,
    lineHeight: 20,
  },
  keywordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  keyword: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  keywordText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  stratagemMeta: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 2,
  },
  stratagemPhase: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.brass,
    letterSpacing: 0.5,
  },
  stratagemType: {
    fontSize: 10,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  stratagemSection: {
    marginBottom: Spacing.xs,
    paddingTop: Spacing.xs,
  },
  stratagemLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.orkGreen,
    letterSpacing: 1,
    marginBottom: 2,
  },
});
