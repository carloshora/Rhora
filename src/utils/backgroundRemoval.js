import * as FileSystem from 'expo-file-system';

const REMOVEBG_URL = 'https://api.remove.bg/v1.0/removebg';

/**
 * Removes background from an image using Remove.bg API.
 * Returns a local URI pointing to the resulting transparent PNG.
 */
export async function removeBackground(imageUri, apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API key do Remove.bg não configurada.');
  }

  // Read image as base64
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const formData = new FormData();
  formData.append('image_file_b64', base64);
  formData.append('size', 'auto');
  formData.append('format', 'png');

  const response = await fetch(REMOVEBG_URL, {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey.trim(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 402) {
      throw new Error('Limite gratuito do Remove.bg atingido (50/mês). Verifique sua conta.');
    }
    if (response.status === 403) {
      throw new Error('API key inválida. Verifique nas configurações.');
    }
    throw new Error(`Erro na remoção de fundo: ${response.status}`);
  }

  // Response is PNG binary
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  const resultBase64 = btoa(binary);

  // Save to temp file
  const outputUri = FileSystem.cacheDirectory + `rmbg_${Date.now()}.png`;
  await FileSystem.writeAsStringAsync(outputUri, resultBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return outputUri;
}
