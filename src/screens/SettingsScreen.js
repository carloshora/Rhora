import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { saveConfig, loadConfig } from '../utils/storage';

export default function SettingsScreen({ navigation }) {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadConfig().then((c) => {
      if (c.removeBgApiKey) setApiKey(c.removeBgApiKey);
    });
  }, []);

  async function handleSave() {
    if (!apiKey.trim()) {
      Alert.alert('Campo vazio', 'Por favor, insira sua API key.');
      return;
    }
    await saveConfig({ removeBgApiKey: apiKey.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    Alert.alert('✅ Salvo!', 'Sua API key foi salva. Agora você pode criar suas figurinhas.');
  }

  function openRemoveBg() {
    Linking.openURL('https://www.remove.bg/api');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />
      <LinearGradient colors={['#0A1628', '#0D2240']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backText}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Configurações</Text>
          </View>

          {/* Remove.bg API Key section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔑 Remove.bg API Key</Text>
            <Text style={styles.sectionDesc}>
              A remoção de fundo usa o Remove.bg. O plano gratuito inclui{' '}
              <Text style={styles.highlight}>50 imagens por mês</Text>.
            </Text>

            <TouchableOpacity style={styles.linkBtn} onPress={openRemoveBg} activeOpacity={0.8}>
              <Text style={styles.linkBtnText}>
                Obter minha chave gratuita →{'\n'}
                <Text style={styles.linkUrl}>remove.bg/api</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.steps}>
              {[
                '1. Acesse remove.bg/api',
                '2. Crie uma conta gratuita',
                '3. Copie sua API key',
                '4. Cole abaixo e salve',
              ].map((s, i) => (
                <Text key={i} style={styles.step}>{s}</Text>
              ))}
            </View>

            <TextInput
              style={styles.input}
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Cole sua API key aqui"
              placeholderTextColor="rgba(255,255,255,0.3)"
              selectionColor="#4ECDC4"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={false}
            />

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={saved ? ['#51CF66', '#2EAF47'] : ['#4ECDC4', '#2BBDB4']}
                style={styles.saveBtnInner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveBtnText}>
                  {saved ? '✅ SALVO!' : 'SALVAR'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* About section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ Sobre o App</Text>
            <Text style={styles.aboutText}>
              <Text style={styles.highlight}>Figurinha Copa</Text> é um app open source e gratuito
              para criar figurinhas personalizadas estilo FIFA 26 para capinhas de celular.{'\n\n'}
              Desenvolvido com ❤️ para a Copa do Mundo 2026.
            </Text>
          </View>

          {/* Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔒 Privacidade</Text>
            <Text style={styles.aboutText}>
              Suas fotos são enviadas somente para o Remove.bg para processamento.
              A API key é armazenada apenas neste dispositivo.
              Nenhum dado é coletado pelo app.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A1628' },
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 48 },
  header: { marginBottom: 28 },
  backBtn: { marginBottom: 16 },
  backText: { color: '#4ECDC4', fontSize: 15, fontWeight: '600' },
  title: { color: 'white', fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  section: {
    backgroundColor: '#1C2A3A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2E4A6A',
  },
  sectionTitle: { color: 'white', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  sectionDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  highlight: { color: '#4ECDC4', fontWeight: '700' },
  linkBtn: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
    marginBottom: 16,
  },
  linkBtnText: { color: '#4ECDC4', fontWeight: '700', fontSize: 14 },
  linkUrl: { color: 'rgba(78,205,196,0.6)', fontSize: 12 },
  steps: { marginBottom: 16, gap: 4 },
  step: { color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 20 },
  input: {
    backgroundColor: '#0D1E30',
    borderWidth: 1.5,
    borderColor: '#2E4A6A',
    borderRadius: 12,
    color: 'white',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  saveBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveBtnInner: { paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: '#0A1628', fontWeight: '900', fontSize: 15, letterSpacing: 1 },
  aboutText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 20 },
});
