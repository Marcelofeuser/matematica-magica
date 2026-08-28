import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

type Props = {
  title?: string;
  message: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
};

export function CenteredMessage({
  title,
  message,
  loading = false,
  actionLabel,
  onAction,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#6C4AB6" />}
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <Pressable style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      )}
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F7F4FF' },
  title: { color: '#6C4AB6', fontSize: 28, fontWeight: '800' },
  message: { marginTop: 12, color: '#4B4263', fontSize: 16, textAlign: 'center' },
  button: { marginTop: 22, borderRadius: 14, paddingHorizontal: 22, paddingVertical: 14, backgroundColor: '#6C4AB6' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
