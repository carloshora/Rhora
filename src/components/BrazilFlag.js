import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BrazilFlag({ size = 48 }) {
  const r = size / 2;
  const innerR = size * 0.38;
  const diamondSize = size * 0.68;

  return (
    <View style={[styles.outer, { width: size, height: size, borderRadius: r }]}>
      {/* Yellow diamond */}
      <View
        style={[
          styles.diamond,
          {
            width: diamondSize,
            height: diamondSize,
            borderRadius: 3,
          },
        ]}
      />
      {/* Blue circle */}
      <View
        style={[
          styles.blueCircle,
          { width: innerR * 2, height: innerR * 2, borderRadius: innerR },
        ]}
      >
        {/* White band */}
        <View style={styles.whiteBand}>
          <Text style={[styles.bandText, { fontSize: size * 0.07 }]}>
            ORDEM E PROGRESSO
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: '#009C3B',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  diamond: {
    backgroundColor: '#FFDF00',
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
  },
  blueCircle: {
    backgroundColor: '#002776',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  whiteBand: {
    backgroundColor: 'white',
    width: '100%',
    height: '22%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bandText: {
    color: '#009C3B',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
