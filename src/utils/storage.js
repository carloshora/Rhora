import * as FileSystem from 'expo-file-system';

const CONFIG_FILE = FileSystem.documentDirectory + 'config.json';

export async function saveConfig(config) {
  await FileSystem.writeAsStringAsync(CONFIG_FILE, JSON.stringify(config));
}

export async function loadConfig() {
  try {
    const content = await FileSystem.readAsStringAsync(CONFIG_FILE);
    return JSON.parse(content);
  } catch {
    return {};
  }
}
