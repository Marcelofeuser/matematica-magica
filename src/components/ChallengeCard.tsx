import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AGE_GROUP_LABELS } from '../constants/options';
import type { AnswerResponse, Challenge } from '../types/challenge';

type Props = {
  challenge: Challenge;
  selectedAnswer: string | null;
  result: AnswerResponse | null;
  submitting: boolean;
  error: string | null;
  onAnswer: (answer: string) => void;
  onNext: () => void;
};

export function ChallengeCard({
  challenge,
  selectedAnswer,
  result,
  submitting,
  error,
  onAnswer,
  onNext,
}: Props) {
  return (
    <View style={styles.content}>
      <Text style={styles.ageGroup}>{AGE_GROUP_LABELS[challenge.age_group]}</Text>
      <Text style={styles.title}>{challenge.title}</Text>
      <Text style={styles.question}>{challenge.question}</Text>

      <View style={styles.options}>
        {challenge.options.map((option) => {
          const isSelected = selectedAnswer === option;
          return (
            <Pressable
              key={option}
              disabled={Boolean(result) || submitting}
              onPress={() => onAnswer(option)}
              style={[
                styles.option,
                isSelected && styles.selectedOption,
                result && isSelected &&
                  (result.is_correct ? styles.correctOption : styles.incorrectOption),
              ]}
            >
              <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {submitting && <ActivityIndicator style={styles.answerLoading} color="#6C4AB6" />}

      {result && (
        <View style={[styles.resultBox, result.is_correct ? styles.correctResult : styles.incorrectResult]}>
          <Text style={styles.resultTitle}>
            {result.is_correct ? '🎉 Muito bem!' : '🤔 Quase!'}
          </Text>
          <Text style={styles.resultText}>{result.explanation}</Text>
          <Pressable style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextButtonText}>Próximo desafio</Text>
          </Pressable>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 24 },
  ageGroup: { color: '#6C4AB6', fontSize: 14, fontWeight: '700', textTransform: 'uppercase' },
  title: { marginTop: 10, color: '#211A30', fontSize: 28, fontWeight: '800' },
  question: { marginTop: 18, color: '#403750', fontSize: 20, lineHeight: 29 },
  options: { gap: 12, marginTop: 28 },
  option: { minHeight: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: 2, borderColor: '#D9CEF4', backgroundColor: '#FFFFFF' },
  selectedOption: { borderColor: '#6C4AB6', backgroundColor: '#EEE7FF' },
  correctOption: { borderColor: '#2E9B64', backgroundColor: '#DDF7E8' },
  incorrectOption: { borderColor: '#D95757', backgroundColor: '#FFE4E4' },
  optionText: { color: '#403750', fontSize: 18, fontWeight: '700' },
  selectedOptionText: { color: '#4D308C' },
  answerLoading: { marginTop: 20 },
  resultBox: { marginTop: 24, borderRadius: 18, padding: 20 },
  correctResult: { backgroundColor: '#DDF7E8' },
  incorrectResult: { backgroundColor: '#FFF1D6' },
  resultTitle: { color: '#211A30', fontSize: 22, fontWeight: '800' },
  resultText: { marginTop: 8, color: '#403750', fontSize: 16, lineHeight: 23 },
  nextButton: { alignItems: 'center', marginTop: 18, borderRadius: 14, padding: 15, backgroundColor: '#6C4AB6' },
  nextButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  errorText: { marginTop: 18, color: '#B83A3A', fontSize: 16, textAlign: 'center' },
});
