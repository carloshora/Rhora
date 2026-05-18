/**
 * Removes image background entirely in the browser using WebAssembly + ML.
 * Uses @imgly/background-removal — free, unlimited, no API key needed.
 * First run downloads the model (~40MB), subsequent runs are cached.
 */
export async function removeBackground(imageFile, onProgress) {
  const { removeBackground: imglyRemoveBg } = await import('@imgly/background-removal');

  const resultBlob = await imglyRemoveBg(imageFile, {
    publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/',
    progress: (key, current, total) => {
      if (onProgress && total > 0) {
        onProgress(Math.round((current / total) * 100), key);
      }
    },
    model: 'medium',
    output: {
      format: 'image/png',
      quality: 1,
    },
  });

  return resultBlob;
}
