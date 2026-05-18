import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { removeBackground } from '../utils/backgroundRemoval';
import { loadConfig } from '../utils/storage';

const { width } = Dimensions.get('window');

export default function PhotoCaptureScreen({ navigation, route }) {
  const { phoneModel, playerData } = route.params;
  const [photo, setPhoto] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState('idle'); // idle | photo-selected | processing | done

  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos acessar sua galeria para escolher a foto.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
      setStep('photo-selected');
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos da câmera para tirar sua foto.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
      setStep('photo-selected');
    }
  }

  async function processPhoto() {
    if (!photo) return;
    setProcessing(true);
    setStep('processing');

    try {
      const config = await loadConfig();
      const apiKey = config.removeBgApiKey || '';

      if (!apiKey) {
        Alert.alert(
          'API Key não configurada',
          'Vá em Configurações e adicione sua chave gratuita do Remove.bg (remove.bg/api).',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Configurações',
              onPress: () => navigation.navigate('Settings'),
            },
          ]
        );
        setStep('photo-selected');
        setProcessing(false);
        return;
      }

      const transparentUri = await removeBackground(photo, apiKey);
      setStep('done');
      navigation.navigate('StickerPreview', {
        phoneModel,
        playerData,
        transparentPhotoUri: transparentUri,
      });
    } catch (err) {
      Alert.alert('Erro ao remover fundo', err.message, [{ text: 'OK' }]);
      setStep('photo-selected');
    } finally {
      setProcessing(false);
    }
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
          <Text style={styles.title}>Sua Foto</Text>
          <Text style={styles.subtitle}>
            Tire uma foto ou escolha da galeria.{'\n'}
            O fundo será removido automaticamente.
          </Text>
        </View>

        {/* Photo preview area */}
        <View style={styles.photoArea}>
          {photo ? (
            <View style={styles.photoPreviewWrapper}>
              <Image source={{ uri: photo }} style={styles.photoPreview} />
              {/* Overlay guide for face position */}
              <View style={styles.faceGuide}>
                <View style={styles.faceOval} />
                <Text style={styles.faceGuideText}>Mantenha o rosto centralizado</Text>
              </View>
            </View>
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.placeholderIcon}>📸</Text>
              <Text style={styles.placeholderText}>Nenhuma foto selecionada</Text>
              <Text style={styles.placeholderHint}>
                Dica: Use foto de frente com boa iluminação
              </Text>
            </View>
          )}
        </View>

        {/* Tips */}
        {!photo && (
          <View style={styles.tips}>
            {[
              '✅  Fundo claro e liso',
              '✅  Rosto e ombros visíveis',
              '✅  Boa iluminação',
              '❌  Evite fundos escuros ou cheios',
            ].map((tip, i) => (
              <Text key={i} style={styles.tip}>{tip}</Text>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          {processing ? (
            <View style={styles.processingBox}>
              <ActivityIndicator size="large" color="#4ECDC4" />
              <Text style={styles.processingText}>Removendo fundo...</Text>
              <Text style={styles.processingHint}>Isso pode levar alguns segundos</Text>
            </View>
          ) : step === 'photo-selected' ? (
            <>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={processPhoto}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#4ECDC4', '#2BBDB4']}
                  style={styles.primaryBtnInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryBtnText}>USAR ESTA FOTO ✨</Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.secondaryActions}>
                <TouchableOpacity style={styles.secondaryBtn} onPress={takePhoto}>
                  <Text style={styles.secondaryBtnText}>📷  Tirar nova foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryBtn} onPress={pickFromGallery}>
                  <Text style={styles.secondaryBtnText}>🖼️  Outra da galeria</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={takePhoto}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#4ECDC4', '#2BBDB4']}
                  style={styles.primaryBtnInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryBtnText}>📷  TIRAR FOTO</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.galleryBtn}
                onPress={pickFromGallery}
                activeOpacity={0.8}
              >
                <Text style={styles.galleryBtnText}>🖼️  ESCOLHER DA GALERIA</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
  photoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  photoPreviewWrapper: {
    width: width * 0.7,
    height: width * 0.93,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  faceGuide: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
  },
  faceOval: {
    width: width * 0.35,
    height: width * 0.42,
    borderRadius: width * 0.21,
    borderWidth: 2,
    borderColor: 'rgba(78, 205, 196, 0.7)',
    borderStyle: 'dashed',
  },
  faceGuideText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  photoPlaceholder: {
    width: width * 0.7,
    height: width * 0.93,
    borderRadius: 16,
    backgroundColor: '#1C2A3A',
    borderWidth: 2,
    borderColor: '#2E4A6A',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: { fontSize: 48, marginBottom: 12 },
  placeholderText: { color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: '600' },
  placeholderHint: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  tips: { paddingHorizontal: 28, marginBottom: 8 },
  tip: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 4 },
  actions: { padding: 24 },
  processingBox: { alignItems: 'center', paddingVertical: 16 },
  processingText: { color: 'white', fontSize: 17, fontWeight: '700', marginTop: 12 },
  processingHint: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 },
  primaryBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnInner: { paddingVertical: 18, alignItems: 'center' },
  primaryBtnText: { color: '#0A1628', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#1C2A3A',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E4A6A',
  },
  secondaryBtnText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  galleryBtn: {
    backgroundColor: '#1C2A3A',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#2E4A6A',
  },
  galleryBtnText: { color: 'rgba(255,255,255,0.8)', fontWeight: '700', fontSize: 15 },
});
