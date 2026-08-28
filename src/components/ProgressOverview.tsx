import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AGE_GROUP_LABELS, THEME_LABELS } from '../constants/options';
import { summarizeAdventure, summarizeProgress } from '../services/progressSummary';
import type { AgeGroup, Theme } from '../types/challenge';
import type { Progress } from '../types/progress';

const ageGroups = Object.keys(AGE_GROUP_LABELS) as AgeGroup[];
const themes = Object.keys(THEME_LABELS) as Theme[];

type Props = {
  profileName: string;
  progress: Progress;
  onClose: () => void;
};

export function ProgressOverview({ profileName, progress, onClose }: Props) {
  const totals = summarizeProgress(progress);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>PROGRESSO DE</Text>
          <Text style={styles.title}>{profileName}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Voltar</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <SummaryItem value={totals.answered} label="respondidos" />
          <View style={styles.divider} />
          <SummaryItem value={totals.correct} label="acertos" />
          <View style={styles.divider} />
          <SummaryItem
            value={totals.percentage}
            label="% de acerto"
          />
        </View>

        <Text style={styles.sectionTitle}>Aventuras</Text>
        {ageGroups.map((ageGroup) => (
          <View key={ageGroup} style={styles.ageSection}>
            <Text style={styles.ageTitle}>{AGE_GROUP_LABELS[ageGroup]}</Text>
            {themes.map((theme) => {
              const { answered, correct, percentage } = summarizeAdventure(
                progress,
                ageGroup,
                theme,
              );
              return (
                <View key={theme} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleGroup}>
                      <Text style={styles.themeIcon}>{theme === 'general' ? '🗺️' : '📖'}</Text>
                      <View>
                        <Text style={styles.themeTitle}>{THEME_LABELS[theme]}</Text>
                        <Text style={styles.detail}>{answered} respondidos · {correct} acertos</Text>
                      </View>
                    </View>
                    <Text style={styles.percentage}>{percentage}%</Text>
                  </View>
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${percentage}%` }]} />
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

type SummaryItemProps = { value: number; label: string };

function SummaryItem({ value, label }: SummaryItemProps) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 18, paddingBottom: 12 },
  eyebrow: { color: '#756A8D', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  title: { marginTop: 3, color: '#211A30', fontSize: 28, fontWeight: '800' },
  closeButton: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 11, backgroundColor: '#EEE7FF' },
  closeText: { color: '#4D308C', fontSize: 15, fontWeight: '800' },
  content: { padding: 24, paddingTop: 10, paddingBottom: 40 },
  summary: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingVertical: 20, paddingHorizontal: 8, backgroundColor: '#6C4AB6' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { color: '#FFFFFF', fontSize: 27, fontWeight: '900' },
  summaryLabel: { marginTop: 3, color: '#E8DFFF', fontSize: 12, fontWeight: '700', textAlign: 'center' },
  divider: { width: 1, height: 38, backgroundColor: '#9175CF' },
  sectionTitle: { marginTop: 28, marginBottom: 4, color: '#211A30', fontSize: 22, fontWeight: '800' },
  ageSection: { marginTop: 18 },
  ageTitle: { marginBottom: 9, color: '#4B4263', fontSize: 17, fontWeight: '800' },
  card: { marginBottom: 10, borderWidth: 1, borderColor: '#E3DAF6', borderRadius: 16, padding: 15, backgroundColor: '#FFFFFF' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitleGroup: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  themeIcon: { marginRight: 11, fontSize: 24 },
  themeTitle: { color: '#302743', fontSize: 15, fontWeight: '800' },
  detail: { marginTop: 3, color: '#81768F', fontSize: 12, fontWeight: '600' },
  percentage: { marginLeft: 8, color: '#6C4AB6', fontSize: 17, fontWeight: '900' },
  track: { height: 7, marginTop: 13, overflow: 'hidden', borderRadius: 4, backgroundColor: '#EEE9F6' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: '#7C5BC4' },
});
