import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { Profile } from '../types/profile';

type Props = {
  profiles: Profile[];
  error: string | null;
  onCreate: (name: string) => void;
  onSelect: (profileId: string) => void;
  onDelete: (profileId: string) => void;
};

export function ProfileSelector({ profiles, error, onCreate, onSelect, onDelete }: Props) {
  const [name, setName] = useState('');

  function create() {
    if (!name.trim()) return;
    onCreate(name);
    setName('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.logo}>✨ Matemática Mágica</Text>
      <Text style={styles.title}>Quem vai jogar?</Text>
      <View style={styles.list}>
        {profiles.map((profile) => (
          <View key={profile.id} style={styles.profileRow}>
            <Pressable style={styles.profileButton} onPress={() => onSelect(profile.id)}>
              <Text style={styles.avatar}>🧙</Text>
              <Text style={styles.profileName}>{profile.name}</Text>
            </Pressable>
            <Pressable
              accessibilityLabel={`Excluir perfil ${profile.name}`}
              onPress={() => onDelete(profile.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Excluir</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <Text style={styles.subtitle}>Criar novo perfil</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nome da criança"
        maxLength={24}
        returnKeyType="done"
        onSubmitEditing={create}
        style={styles.input}
      />
      <Pressable
        disabled={!name.trim()}
        onPress={create}
        style={[styles.createButton, !name.trim() && styles.disabled]}
      >
        <Text style={styles.createText}>Criar perfil</Text>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F7F4FF' },
  logo: { color: '#6C4AB6', fontSize: 24, fontWeight: '800' },
  title: { marginTop: 28, color: '#211A30', fontSize: 30, fontWeight: '800' },
  list: { gap: 10, marginTop: 22 },
  profileRow: { flexDirection: 'row', gap: 8 },
  profileButton: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 14, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#D9CEF4' },
  avatar: { fontSize: 26 },
  profileName: { color: '#403750', fontSize: 18, fontWeight: '800' },
  deleteButton: { justifyContent: 'center', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#FFE4E4' },
  deleteText: { color: '#A93636', fontWeight: '700' },
  subtitle: { marginTop: 28, marginBottom: 10, color: '#403750', fontSize: 18, fontWeight: '700' },
  input: { borderWidth: 2, borderColor: '#D9CEF4', borderRadius: 14, padding: 15, fontSize: 17, backgroundColor: '#FFFFFF' },
  createButton: { alignItems: 'center', marginTop: 12, borderRadius: 14, padding: 15, backgroundColor: '#6C4AB6' },
  createText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  disabled: { opacity: 0.45 },
  error: { marginTop: 14, color: '#B83A3A', textAlign: 'center' },
});
