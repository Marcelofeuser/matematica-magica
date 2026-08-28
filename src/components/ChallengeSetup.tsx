import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AGE_GROUP_LABELS, THEME_LABELS } from '../constants/options';
import { summarizeAdventure } from '../services/progressSummary';
import type { AgeGroup, Theme } from '../types/challenge';
import type { Progress } from '../types/progress';

const ageGroups = Object.keys(AGE_GROUP_LABELS) as AgeGroup[];
const themes = Object.keys(THEME_LABELS) as Theme[];

type Props = {
  ageGroup: AgeGroup | null;
  theme: Theme | null;
  loading: boolean;
  error: string | null;
  progress: Progress;
  profileName: string;
  onOpenProgress: () => void;
  onChangeProfile: () => void;
  onAgeGroupChange: (ageGroup: AgeGroup) => void;
  onThemeChange: (theme: Theme) => void;
  onStart: () => void;
};

export function ChallengeSetup({
  ageGroup,
  theme,
  loading,
  error,
  progress,
  profileName,
  onOpenProgress,
  onChangeProfile,
  onAgeGroupChange,
  onThemeChange,
  onStart,
}: Props) {
  const ready = Boolean(ageGroup && theme) && !loading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        <View>
          <Text style={styles.logo}>✨ Matemática Mágica</Text>
          <Text style={styles.profileName}>🧙 {profileName}</Text>
        </View>
        <View style={styles.topActions}>
          <Pressable onPress={onOpenProgress} style={styles.smallButton}>
            <Text style={styles.smallButtonText}>Progresso</Text>
          </Pressable>
          <Pressable onPress={onChangeProfile} style={styles.smallButton}>
            <Text style={styles.smallButtonText}>Perfil</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.title}>Escolha sua aventura</Text>
      <Text style={styles.subtitle}>Qual é a faixa etária?</Text>

      <View style={styles.options}>
        {ageGroups.map((value) => (
          <Choice
            key={value}
            label={AGE_GROUP_LABELS[value]}
            selected={ageGroup === value}
            onPress={() => onAgeGroupChange(value)}
          />
        ))}
      </View>

      <Text style={styles.subtitle}>Qual tema você prefere?</Text>
      <View style={styles.options}>
        {themes.map((value) => (
          <Choice
            key={value}
            label={THEME_LABELS[value]}
            selected={theme === value}
            detail={ageGroup ? adventureDetail(progress, ageGroup, value) : undefined}
            onPress={() => onThemeChange(value)}
          />
        ))}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable
        disabled={!ready}
        onPress={onStart}
        style={[styles.startButton, !ready && styles.disabledButton]}
      >
        <Text style={styles.startButtonText}>
          {loading ? 'Carregando...' : 'Começar aventura'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

type ChoiceProps = {
  label: string;
  selected: boolean;
  detail?: string;
  onPress: () => void;
};

function Choice({ label, selected, detail, onPress }: ChoiceProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choice, selected && styles.selectedChoice]}
    >
      <Text style={[styles.choiceText, selected && styles.selectedChoiceText]}>
        {label}
      </Text>
      {detail && <Text style={styles.choiceDetail}>{detail}</Text>}
    </Pressable>
  );
}

function adventureDetail(progress: Progress, ageGroup: AgeGroup, theme: Theme): string {
  const summary = summarizeAdventure(progress, ageGroup, theme);
  if (!summary.answered) return 'Ainda não iniciada';
  return `${summary.correct} de ${summary.answered} acertos · ${summary.percentage}%`;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F7F4FF' },
  topBar: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  topActions: { gap: 7, marginLeft: 8 },
  smallButton: { alignItems: 'center', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#EEE7FF' },
  smallButtonText: { color: '#4D308C', fontSize: 13, fontWeight: '800' },
  profileName: { marginTop: 5, color: '#756A8D', fontSize: 13, fontWeight: '700' },
  logo: { color: '#6C4AB6', fontSize: 24, fontWeight: '800' },
  title: { marginTop: 28, color: '#211A30', fontSize: 30, fontWeight: '800' },
  subtitle: { marginTop: 24, marginBottom: 10, color: '#403750', fontSize: 18, fontWeight: '700' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  choice: { borderWidth: 2, borderColor: '#D9CEF4', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF' },
  selectedChoice: { borderColor: '#6C4AB6', backgroundColor: '#EEE7FF' },
  choiceText: { color: '#403750', fontSize: 16, fontWeight: '700' },
  selectedChoiceText: { color: '#4D308C' },
  choiceDetail: { marginTop: 4, color: '#81768F', fontSize: 11, fontWeight: '600' },
  error: { marginTop: 18, color: '#B83A3A', fontSize: 15, textAlign: 'center' },
  startButton: { alignItems: 'center', marginTop: 28, borderRadius: 16, padding: 17, backgroundColor: '#6C4AB6' },
  disabledButton: { opacity: 0.45 },
  startButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
});
