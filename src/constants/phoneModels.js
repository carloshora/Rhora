// Print dimensions at 300 DPI for each phone model
// Width/height in pixels; cameraX/Y as 0-1 fraction of the image

export const PHONE_MODELS = [
  {
    id: 'iphone_12_13_14',
    name: 'iPhone 12 / 13 / 14',
    emoji: '',
    printWidth: 843,   // 71.5mm @ 300dpi
    printHeight: 1844, // 156mm @ 300dpi (with bleed)
    cameraStyle: 'notch-left',
    // How far right the sticker content should shift (fraction of width)
    contentOffsetX: 0.08,
  },
  {
    id: 'iphone_15_16_pro_max',
    name: 'iPhone 15 / 16 Pro Max',
    emoji: '',
    printWidth: 968,   // 82mm @ 300dpi
    printHeight: 2008, // 170mm @ 300dpi
    cameraStyle: 'dynamic-island',
    contentOffsetX: 0.06,
  },
  {
    id: 'samsung_s25_plus',
    name: 'Samsung S25 / S25+',
    emoji: '',
    printWidth: 905,   // 76.7mm @ 300dpi
    printHeight: 1902, // 161.1mm @ 300dpi
    cameraStyle: 'punch-hole-center',
    contentOffsetX: 0.06,
  },
  {
    id: 'android_generic',
    name: 'Android Genérico',
    emoji: '',
    printWidth: 850,
    printHeight: 1890,
    cameraStyle: 'punch-hole-center',
    contentOffsetX: 0.06,
  },
];
