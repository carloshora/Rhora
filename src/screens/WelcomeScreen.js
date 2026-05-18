import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StickerCard from '../components/StickerCard';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');
const PREVIEW_W = width * 0.42;

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />
      <LinearGradient colors={['#0A1628', '#0D2240', '#0A1628']} style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.badge}>⚽ FIFA 26</Text>
          <Text style={styles.title}>Figurinha{'\n'}da Copa</Text>
          <Text style={styles.subtitle}>
            Vire um jogador profissional{'\n'}da Seleção Brasileira
          </Text>
        </View>

        {/* Preview sticker (demo, no photo) */}
        <View style={styles.previewContainer}>
          <View style={styles.previewShadow}>
            <StickerCard
              playerPhoto={null}
              playerName="Você aqui"
              jerseyNumber="10"
              clubName="Seu clube"
              cardWidth={PREVIEW_W}
              contentOffsetX={0}
            />
          </View>
        </View>

        {/* CTA */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('PhoneModel')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#4ECDC4', '#2BBDB4']}
              style={styles.primaryBtnInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryBtnText}>CRIAR MINHA FIGURINHA</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.settingsBtnText}>⚙️  Configurações</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Open source · Grátis · Copa 2026</Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A1628' },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 24 },
  header: { alignItems: 'center', marginTop: 32 },
  badge: {
    backgroundColor: '#FFDF00',
    color: '#0A1628',
    fontWeight: '800',
    fontSize: 13,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    letterSpacing: 1,
  },
  title: {
    color: 'white',
    fontSize: 42,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 46,
    letterSpacing: -1,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  previewShadow: {
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 16,
  },
  actions: { width: '100%', paddingBottom: 16 },
  primaryBtn: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnInner: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#0A1628',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1.5,
  },
  settingsBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsBtnText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  footer: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 11,
    marginBottom: 8,
  },
});
