import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PHONE_MODELS } from '../constants/phoneModels';
import { COLORS } from '../constants/theme';

export default function PhoneModelScreen({ navigation }) {
  const [selected, setSelected] = useState(PHONE_MODELS[0].id);

  const selectedModel = PHONE_MODELS.find((m) => m.id === selected);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />
      <LinearGradient colors={['#0A1628', '#0D2240']} style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Seu Celular</Text>
          <Text style={styles.subtitle}>
            Escolha o modelo para ajustar{'\n'}a imagem da capinha
          </Text>
        </View>

        {/* Model list */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {PHONE_MODELS.map((model) => {
            const isSelected = model.id === selected;
            return (
              <TouchableOpacity
                key={model.id}
                onPress={() => setSelected(model.id)}
                activeOpacity={0.8}
                style={[styles.modelCard, isSelected && styles.modelCardSelected]}
              >
                <View style={styles.modelLeft}>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View>
                    <Text style={[styles.modelName, isSelected && styles.modelNameSelected]}>
                      {model.name}
                    </Text>
                    <Text style={styles.modelDims}>
                      {model.printWidth} × {model.printHeight} px · 300 DPI
                    </Text>
                  </View>
                </View>
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Camera info box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>📸</Text>
            <Text style={styles.infoText}>
              A imagem será deslocada levemente para a direita para evitar que o rosto
              cubra o buraco da câmera.
            </Text>
          </View>
        </ScrollView>

        {/* Continue button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.navigate('PlayerSetup', { phoneModel: selectedModel })}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#4ECDC4', '#2BBDB4']}
              style={styles.continueBtnInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueBtnText}>CONTINUAR →</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  scroll: { flex: 1 },
  list: { padding: 24, gap: 12 },
  modelCard: {
    backgroundColor: '#1C2A3A',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modelCardSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: '#1A3040',
  },
  modelLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: '#4ECDC4' },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#4ECDC4',
  },
  modelName: { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: '600' },
  modelNameSelected: { color: 'white' },
  modelDims: { color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 2 },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: { color: '#0A1628', fontWeight: '900', fontSize: 14 },
  infoBox: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.2)',
  },
  infoIcon: { fontSize: 18 },
  infoText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, flex: 1, lineHeight: 18 },
  footer: { padding: 24 },
  continueBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  continueBtnInner: { paddingVertical: 18, alignItems: 'center' },
  continueBtnText: { color: '#0A1628', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
});
