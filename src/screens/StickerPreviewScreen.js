import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import StickerCard from '../components/StickerCard';

const { width } = Dimensions.get('window');
const CARD_PREVIEW_W = width * 0.72;

export default function StickerPreviewScreen({ navigation, route }) {
  const { phoneModel, playerData, transparentPhotoUri } = route.params;
  const stickerRef = useRef(null);
  const [saving, setSaving] = useState(false);

  async function saveToGallery() {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Precisamos de acesso à galeria para salvar sua figurinha.',
          [{ text: 'OK' }]
        );
        setSaving(false);
        return;
      }

      // pixelRatio: 3 multiplies the rendered size → near print-ready resolution
      const uri = await captureRef(stickerRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
        pixelRatio: 3,
      });

      await MediaLibrary.saveToLibraryAsync(uri);

      Alert.alert(
        '🎉 Figurinha salva!',
        'Sua figurinha foi salva na galeria em alta resolução, pronta para imprimir na capinha!',
        [
          {
            text: 'Criar outra',
            onPress: () => navigation.navigate('Welcome'),
          },
          { text: 'Ver na galeria', style: 'default' },
        ]
      );
    } catch (err) {
      Alert.alert('Erro ao salvar', err.message, [{ text: 'OK' }]);
    } finally {
      setSaving(false);
    }
  }

  function retakePhoto() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />
      <LinearGradient colors={['#0A1628', '#0D2240']} style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Sua Figurinha</Text>
          <Text style={styles.subtitle}>
            A foto ficou boa? Salve em alta resolução{'\n'}para imprimir na capinha!
          </Text>
        </View>

        {/* Sticker preview */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Camera hole position hint */}
          <View style={styles.phoneHint}>
            <Text style={styles.phoneHintText}>
              📱 {phoneModel.name}
            </Text>
            <Text style={styles.phoneHintSub}>
              Imagem deslocada para evitar a câmera
            </Text>
          </View>

          {/* The actual sticker — this is what gets captured */}
          <View style={styles.stickerWrapper}>
            <View
              ref={stickerRef}
              collapsable={false}
              style={styles.stickerCapture}
            >
              <StickerCard
                playerPhoto={transparentPhotoUri}
                playerName={playerData.playerName}
                jerseyNumber={playerData.jerseyNumber}
                clubName={playerData.clubName}
                cardWidth={CARD_PREVIEW_W}
                contentOffsetX={phoneModel.contentOffsetX}
              />
            </View>
          </View>

          {/* Resolution info */}
          <View style={styles.resolutionBadge}>
            <Text style={styles.resolutionText}>
              💾 Exporta em {phoneModel.printWidth} × {phoneModel.printHeight} px · 300 DPI
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            {/* Main CTA: Photo good? */}
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>A foto ficou boa?</Text>
              <View style={styles.questionButtons}>
                {saving ? (
                  <View style={styles.savingBox}>
                    <ActivityIndicator size="small" color="#4ECDC4" />
                    <Text style={styles.savingText}>Salvando em alta resolução...</Text>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.yesBtn}
                      onPress={saveToGallery}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={['#51CF66', '#2EAF47']}
                        style={styles.yesBtnInner}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Text style={styles.yesBtnText}>✓  SIM, SALVAR!</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.noBtn}
                      onPress={retakePhoto}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.noBtnText}>✗  NÃO, TIRAR OUTRA</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A1628' },
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backBtn: { marginBottom: 16 },
  backText: { color: '#4ECDC4', fontSize: 15, fontWeight: '600' },
  title: { color: 'white', fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 6, lineHeight: 20 },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  phoneHint: { alignItems: 'center', marginBottom: 12 },
  phoneHintText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  phoneHintSub: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 },
  stickerWrapper: {
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 20,
    marginBottom: 16,
  },
  stickerCapture: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  resolutionBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.12)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.25)',
    marginBottom: 24,
  },
  resolutionText: { color: 'rgba(78, 205, 196, 0.9)', fontSize: 12 },
  actions: { width: '100%' },
  questionBox: {
    backgroundColor: '#1C2A3A',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2E4A6A',
  },
  questionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  questionButtons: { gap: 10 },
  savingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  savingText: { color: '#4ECDC4', fontSize: 15, fontWeight: '600' },
  yesBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#51CF66',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  yesBtnInner: { paddingVertical: 16, alignItems: 'center' },
  yesBtnText: { color: 'white', fontWeight: '900', fontSize: 15, letterSpacing: 1 },
  noBtn: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  noBtnText: { color: '#FF6B6B', fontWeight: '700', fontSize: 14, letterSpacing: 0.5 },
});
