import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

type Props = {
  correct: number;
  total: number;
  onRestart: () => void;
  onChangeAdventure: () => void;
};

export function AdventureComplete({
  correct,
  total,
  onRestart,
  onChangeAdventure,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.emoji}>🏆</Text>
      <Text style={styles.title}>Aventura concluída!</Text>
      <Text style={styles.message}>
        Você acertou {correct} de {total} desafios desta aventura.
      </Text>
      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={onRestart}>
          <Text style={styles.primaryText}>Jogar novamente</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onChangeAdventure}>
          <Text style={styles.secondaryText}>Escolher outra aventura</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: '#F7F4FF' },
  emoji: { fontSize: 64 },
  title: { marginTop: 18, color: '#211A30', fontSize: 30, fontWeight: '800', textAlign: 'center' },
  message: { marginTop: 14, color: '#4B4263', fontSize: 18, lineHeight: 26, textAlign: 'center' },
  actions: { alignSelf: 'stretch', gap: 12, marginTop: 30 },
  primaryButton: { alignItems: 'center', borderRadius: 16, padding: 17, backgroundColor: '#6C4AB6' },
  primaryText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  secondaryButton: { alignItems: 'center', borderRadius: 16, borderWidth: 2, borderColor: '#D9CEF4', padding: 15, backgroundColor: '#FFFFFF' },
  secondaryText: { color: '#4D308C', fontSize: 16, fontWeight: '800' },
});
