import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { CenteredMessage } from './src/components/CenteredMessage';
import { AdventureComplete } from './src/components/AdventureComplete';
import { ChallengeCard } from './src/components/ChallengeCard';
import { ChallengeSetup } from './src/components/ChallengeSetup';
import { ProfileSelector } from './src/components/ProfileSelector';
import { ProgressOverview } from './src/components/ProgressOverview';
import { answerChallenge, getChallenges } from './src/services/challenges';
import { prepareChallengeOrder, shuffleChallenges } from './src/services/challengeOrder';
import { getAdventureProgress, loadProgress, recordAnswer } from './src/services/progress';
import { addProfile, getProfileProgress, removeProfile, selectProfile, setProfileProgress, EMPTY_PROFILES_STATE } from './src/services/profileLogic';
import { loadProfiles, saveProfiles } from './src/services/profiles';
import type { AgeGroup, AnswerResponse, Challenge, Theme } from './src/types/challenge';
import type { Progress } from './src/types/progress';
import type { ProfilesState } from './src/types/profile';

export default function App() {
  const [profilesState, setProfilesState] = useState<ProfilesState>(EMPTY_PROFILES_STATE);
  const profilesRef = useRef<ProfilesState>(EMPTY_PROFILES_STATE);
  const [profilesLoaded, setProfilesLoaded] = useState(false);
  const [choosingProfile, setChoosingProfile] = useState(true);
  const [showingProgress, setShowingProgress] = useState(false);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [started, setStarted] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const submittingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [legacyProgress, setLegacyProgress] = useState<Progress | null>(null);
  const activeProfile = profilesState.profiles.find(
    (profile) => profile.id === profilesState.activeProfileId,
  );
  const progress = getProfileProgress(profilesState, profilesState.activeProfileId);
  const currentChallenge = challenges[currentIndex];

  useEffect(() => {
    Promise.all([loadProfiles(), loadProgress().catch(() => null)])
      .then(([storedProfiles, oldProgress]) => {
        profilesRef.current = storedProfiles;
        setProfilesState(storedProfiles);
        setLegacyProgress(oldProgress);
        setChoosingProfile(!storedProfiles.activeProfileId);
      })
      .catch(() => setError('Não foi possível carregar os perfis salvos.'))
      .finally(() => setProfilesLoaded(true));
  }, []);

  async function persistProfiles(next: ProfilesState) {
    profilesRef.current = next;
    setProfilesState(next);
    try {
      await saveProfiles(next);
    } catch {
      setError('Não foi possível salvar os perfis neste aparelho.');
    }
  }

  function createProfile(name: string) {
    try {
      const initialProgress = profilesState.profiles.length === 0 && legacyProgress
        ? legacyProgress
        : undefined;
      const next = addProfile(profilesState, {
        id: `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        createdAt: new Date().toISOString(),
      }, initialProgress);
      void persistProfiles(next);
      setChoosingProfile(false);
      setError(null);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Não foi possível criar o perfil.');
    }
  }

  function chooseProfile(profileId: string) {
    const next = selectProfile(profilesState, profileId);
    void persistProfiles(next);
    setChoosingProfile(false);
    setError(null);
  }

  function deleteProfile(profileId: string) {
    const profile = profilesState.profiles.find((item) => item.id === profileId);
    if (!profile) return;
    Alert.alert(
      'Excluir perfil?',
      `O progresso de ${profile.name} também será excluído.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => void persistProfiles(removeProfile(profilesRef.current, profileId)),
        },
      ],
    );
  }

  async function startChallenges() {
    if (!ageGroup || !theme || loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getChallenges({ ageGroup, theme });
      if (data.length === 0) {
        setError('Ainda não há desafios para esta combinação. Escolha outra aventura.');
        return;
      }
      const answeredIds = getAdventureProgress(progress, ageGroup, theme).answeredChallengeIds;
      setChallenges(prepareChallengeOrder(data, answeredIds));
      setCurrentIndex(0);
      setStarted(true);
    } catch {
      setError('Não foi possível conectar à API. Confirme se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer(answer: string) {
    if (!currentChallenge || submittingRef.current || result) return;
    submittingRef.current = true;
    setSelectedAnswer(answer);
    setSubmitting(true);
    setError(null);
    try {
      const data = await answerChallenge(currentChallenge.id, answer);
      setResult(data);
      if (ageGroup && theme) {
        try {
          const nextProgress = await recordAnswer(
            progress,
            ageGroup,
            theme,
            currentChallenge.id,
            data.is_correct,
          );
          const activeProfileId = profilesRef.current.activeProfileId;
          if (activeProfileId) {
            await persistProfiles(setProfileProgress(
              profilesRef.current,
              activeProfileId,
              nextProgress,
            ));
          }
        } catch {
          setError('A resposta foi corrigida, mas não foi possível salvar o progresso.');
        }
      }
    } catch {
      setSelectedAnswer(null);
      setError('Não foi possível enviar a resposta. Tente novamente.');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function resetChallengeState() {
    setSelectedAnswer(null);
    setResult(null);
    setError(null);
  }

  function nextChallenge() {
    if (currentIndex === challenges.length - 1) {
      setCompleted(true);
      return;
    }
    setCurrentIndex((index) => index + 1);
    resetChallengeState();
  }

  function restartAdventure() {
    setChallenges((current) => shuffleChallenges(current));
    setCurrentIndex(0);
    setCompleted(false);
    resetChallengeState();
  }

  function changeAdventure() {
    setStarted(false);
    setChallenges([]);
    setCurrentIndex(0);
    setCompleted(false);
    resetChallengeState();
  }

  if (!profilesLoaded) {
    return <CenteredMessage loading message="Carregando perfis..." />;
  }

  if (choosingProfile || !activeProfile) {
    return (
      <ProfileSelector
        profiles={profilesState.profiles}
        error={error}
        onCreate={createProfile}
        onSelect={chooseProfile}
        onDelete={deleteProfile}
      />
    );
  }

  if (showingProgress) {
    return (
      <ProgressOverview
        profileName={activeProfile.name}
        progress={progress}
        onClose={() => setShowingProgress(false)}
      />
    );
  }

  if (!started) {
    return (
      <ChallengeSetup
        ageGroup={ageGroup}
        theme={theme}
        loading={loading}
        error={error}
        progress={progress}
        profileName={activeProfile.name}
        onOpenProgress={() => setShowingProgress(true)}
        onChangeProfile={() => setChoosingProfile(true)}
        onAgeGroupChange={setAgeGroup}
        onThemeChange={setTheme}
        onStart={startChallenges}
      />
    );
  }

  if (!currentChallenge) {
    return (
      <CenteredMessage
        title="Ops!"
        message="Nenhum desafio disponível."
        actionLabel="Tentar novamente"
        onAction={changeAdventure}
      />
    );
  }

  if (completed) {
    const adventureProgress = ageGroup && theme
      ? getAdventureProgress(progress, ageGroup, theme)
      : { correctChallengeIds: [] };
    return (
      <AdventureComplete
        correct={adventureProgress.correctChallengeIds.length}
        total={challenges.length}
        onRestart={restartAdventure}
        onChangeAdventure={changeAdventure}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.logo}>✨ Matemática Mágica</Text>
          <Text style={styles.profileName}>🧙 {activeProfile.name}</Text>
          <Text style={styles.progress}>
            Desafio {currentIndex + 1} de {challenges.length} ·{' '}
            ⭐ {ageGroup && theme
              ? getAdventureProgress(progress, ageGroup, theme).correctChallengeIds.length
              : 0} de {challenges.length} concluídos
          </Text>
          <Text style={styles.answeredProgress}>
            {ageGroup && theme
              ? getAdventureProgress(progress, ageGroup, theme).answeredChallengeIds.length
              : 0} desafios respondidos
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={() => setShowingProgress(true)} style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Progresso</Text>
          </Pressable>
          <Pressable onPress={changeAdventure} style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Aventura</Text>
          </Pressable>
          <Pressable onPress={() => { changeAdventure(); setChoosingProfile(true); }} style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Perfil</Text>
          </Pressable>
        </View>
      </View>
      <ChallengeCard
        challenge={currentChallenge}
        selectedAnswer={selectedAnswer}
        result={result}
        submitting={submitting}
        error={error}
        onAnswer={submitAnswer}
        onNext={nextChallenge}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12 },
  headerText: { flex: 1 },
  headerActions: { gap: 6, marginLeft: 8 },
  profileName: { marginTop: 4, color: '#4D308C', fontSize: 13, fontWeight: '700' },
  logo: { color: '#6C4AB6', fontSize: 24, fontWeight: '800' },
  progress: { marginTop: 8, color: '#756A8D', fontSize: 14, fontWeight: '600' },
  answeredProgress: { marginTop: 3, color: '#8C829D', fontSize: 12, fontWeight: '600' },
  changeButton: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#EEE7FF' },
  changeButtonText: { color: '#4D308C', fontSize: 14, fontWeight: '800' },
});
