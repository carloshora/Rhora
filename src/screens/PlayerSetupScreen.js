import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

export default function PlayerSetupScreen({ navigation, route }) {
  const { phoneModel } = route.params;
  const [playerName, setPlayerName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [clubName, setClubName] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!playerName.trim()) e.playerName = 'Digite seu nome';
    if (!jerseyNumber.trim()) e.jerseyNumber = 'Digite o número';
    if (jerseyNumber && (isNaN(jerseyNumber) || +jerseyNumber < 1 || +jerseyNumber > 99)) {
      e.jerseyNumber = 'Número entre 1 e 99';
    }
    if (!clubName.trim()) e.clubName = 'Digite o clube';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleContinue() {
    if (!validate()) return;
    navigation.navigate('PhotoCapture', {
      phoneModel,
      playerData: {
        playerName: playerName.trim(),
        jerseyNumber: jerseyNumber.trim(),
        clubName: clubName.trim(),
      },
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient colors={['#0A1628', '#0D2240']} style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Text style={styles.backText}>← Voltar</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Seus Dados</Text>
              <Text style={styles.subtitle}>
                Preencha como aparecerá na sua figurinha
              </Text>
            </View>

            {/* Jersey number badge preview */}
            <View style={styles.badgePreview}>
              <View style={styles.jerseyBadge}>
                <Text style={styles.jerseyBadgeNumber}>
                  {jerseyNumber || '10'}
                </Text>
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeName}>
                  {playerName || 'SEU NOME'}
                </Text>
                <Text style={styles.badgeClub}>
                  {clubName || 'SEU CLUBE'} · BRA
                </Text>
              </View>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Field
                label="Nome do Jogador"
                placeholder="Ex: Carlos Silva"
                value={playerName}
                onChangeText={setPlayerName}
                error={errors.playerName}
                autoCapitalize="words"
                maxLength={24}
              />

              <Field
                label="Número da Camisa"
                placeholder="Ex: 10"
                value={jerseyNumber}
                onChangeText={setJerseyNumber}
                error={errors.jerseyNumber}
                keyboardType="number-pad"
                maxLength={2}
              />

              <Field
                label="Clube / Cidade"
                placeholder="Ex: Flamengo"
                value={clubName}
                onChangeText={setClubName}
                error={errors.clubName}
                autoCapitalize="words"
                maxLength={24}
              />
            </View>

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#4ECDC4', '#2BBDB4']}
                style={styles.continueBtnInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.continueBtnText}>ESCOLHER FOTO →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, error, style: extraStyle, ...inputProps }) {
  return (
    <View style={fieldStyles.wrapper}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="rgba(255,255,255,0.3)"
        selectionColor="#4ECDC4"
        {...inputProps}
        style={[fieldStyles.input, error ? fieldStyles.inputError : null, extraStyle]}
      />
      {error ? <Text style={fieldStyles.error}>{error}</Text> : null}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#1C2A3A',
    borderWidth: 1.5,
    borderColor: '#2E4A6A',
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputError: { borderColor: '#FF6B6B' },
  error: { color: '#FF6B6B', fontSize: 12, marginTop: 4 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A1628' },
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 24 },
  backBtn: { marginBottom: 16 },
  backText: { color: '#4ECDC4', fontSize: 15, fontWeight: '600' },
  title: { color: 'white', fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 6 },
  badgePreview: {
    backgroundColor: '#1A8A82',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 28,
  },
  jerseyBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFDF00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jerseyBadgeNumber: {
    color: '#0A1628',
    fontWeight: '900',
    fontSize: 24,
  },
  badgeInfo: { flex: 1 },
  badgeName: {
    color: 'white',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  badgeClub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
  },
  form: { marginBottom: 8 },
  continueBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 8,
  },
  continueBtnInner: { paddingVertical: 18, alignItems: 'center' },
  continueBtnText: { color: '#0A1628', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
});
