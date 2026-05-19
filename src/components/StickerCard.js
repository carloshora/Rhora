import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import BrazilFlag from './BrazilFlag';

/**
 * Renders a FIFA 26 Brazil-style sticker card.
 *
 * Props:
 *  - playerPhoto: URI string (transparent PNG from remove.bg)
 *  - playerName: string
 *  - jerseyNumber: string
 *  - clubName: string
 *  - cardWidth: number (render width in px)
 *  - contentOffsetX: 0-1 fraction to shift content right (avoid camera hole)
 */
export default function StickerCard({
  playerPhoto,
  playerName = 'SEU NOME',
  jerseyNumber = '10',
  clubName = 'SEU CLUBE',
  cardWidth = 320,
  contentOffsetX = 0,
}) {
  // Card maintains a 9:19 aspect ratio (portrait phone case)
  const W = cardWidth;
  const H = Math.round(W * (19 / 9));

  // Horizontal shift to keep face away from camera hole
  const shift = W * contentOffsetX;

  const flagSize = W * 0.18;
  const panelH = H * 0.21;
  const photoH = H * 0.80;

  return (
    <View style={[styles.card, { width: W, height: H }]}>
      {/* ── Turquoise background ── */}
      <View style={[styles.bg, { backgroundColor: '#4ECDC4' }]} />

      {/* ── Large decorative green blob (left) ── */}
      <View
        style={{
          position: 'absolute',
          left: -W * 0.05 + shift,
          top: 0,
          width: W * 0.52,
          height: H * 0.72,
          backgroundColor: '#009C3B',
          borderBottomRightRadius: W * 0.45,
          borderTopRightRadius: W * 0.08,
        }}
      />

      {/* ── Yellow accent rectangle ── */}
      <View
        style={{
          position: 'absolute',
          left: W * 0.28 + shift,
          top: H * 0.30,
          width: W * 0.38,
          height: H * 0.16,
          backgroundColor: '#FFDF00',
        }}
      />

      {/* ── Small green rectangle behind yellow ── */}
      <View
        style={{
          position: 'absolute',
          left: W * 0.24 + shift,
          top: H * 0.34,
          width: W * 0.14,
          height: H * 0.10,
          backgroundColor: '#007A2F',
        }}
      />

      {/* ── FIFA 26 Logo (top right) ── */}
      <View
        style={{
          position: 'absolute',
          right: W * 0.04 - shift * 0.5,
          top: H * 0.025,
          alignItems: 'center',
          backgroundColor: '#3BBAC8',
          borderRadius: 8,
          paddingHorizontal: W * 0.03,
          paddingVertical: H * 0.006,
        }}
      >
        <Text
          style={{
            fontSize: W * 0.14,
            fontWeight: '900',
            color: 'white',
            letterSpacing: -2,
            lineHeight: W * 0.14,
          }}
        >
          26
        </Text>
        <Text
          style={{
            fontSize: W * 0.055,
            fontWeight: '800',
            color: 'white',
            letterSpacing: 4,
            marginTop: -2,
          }}
        >
          FIFA
        </Text>
      </View>

      {/* ── Player photo (transparent PNG) ── */}
      {playerPhoto ? (
        <Image
          source={{ uri: playerPhoto }}
          style={{
            position: 'absolute',
            bottom: panelH,
            left: shift,
            width: W,
            height: photoH,
            resizeMode: 'contain',
          }}
        />
      ) : (
        // Placeholder when no photo yet
        <View
          style={{
            position: 'absolute',
            bottom: panelH,
            left: shift,
            width: W,
            height: photoH,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: W * 0.18, opacity: 0.3 }}>👤</Text>
          <Text
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: W * 0.04,
              marginTop: 8,
              textAlign: 'center',
            }}
          >
            Sua foto aqui
          </Text>
        </View>
      )}

      {/* ── Brazil flag + BRA text (right side) ── */}
      <View
        style={{
          position: 'absolute',
          right: W * 0.04 - shift * 0.5,
          top: H * 0.46,
          alignItems: 'center',
        }}
      >
        <BrazilFlag size={flagSize} />
        <Text
          style={{
            color: 'white',
            fontWeight: '900',
            fontSize: W * 0.065,
            letterSpacing: 2,
            marginTop: H * 0.008,
            textShadowColor: 'rgba(0,0,0,0.4)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}
        >
          BRA
        </Text>
      </View>

      {/* ── Bottom info panel ── */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: W,
          height: panelH,
          backgroundColor: '#1A8A82',
        }}
      >
        {/* Separator line */}
        <View
          style={{
            height: 3,
            backgroundColor: '#147068',
            width: '100%',
          }}
        />

        {/* Player name */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: W * 0.04,
          }}
        >
          <Text
            style={{
              color: 'white',
              fontWeight: '900',
              fontSize: W * 0.072,
              letterSpacing: 0.5,
              textAlign: 'center',
            }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {playerName.toUpperCase()}
          </Text>

          {/* Jersey number and club */}
          <Text
            style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: W * 0.042,
              fontWeight: '600',
              marginTop: H * 0.006,
              letterSpacing: 0.5,
            }}
          >
            #{jerseyNumber} | {clubName.toUpperCase()}
          </Text>
        </View>

        {/* Bottom bar: Panini branding */}
        <View
          style={{
            height: panelH * 0.28,
            backgroundColor: '#147068',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: W * 0.04,
          }}
        >
          <View
            style={{
              backgroundColor: '#FF6600',
              borderRadius: 4,
              paddingHorizontal: W * 0.025,
              paddingVertical: 2,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontWeight: '900',
                fontSize: W * 0.038,
                letterSpacing: 1,
              }}
            >
              PANINI
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
});
