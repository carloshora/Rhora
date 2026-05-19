# ⚽ Figurinha Copa — FIFA 26

App mobile gratuito e open source para criar **figurinhas personalizadas** estilo Panini FIFA 26, perfeitas para impressão em capinhas de celular.

## Como funciona

1. **Escolha o modelo do celular** → iPhone 12/13/14, iPhone 15/16 Pro Max, Samsung S25+
2. **Preencha seus dados** → Nome, número da camisa, clube
3. **Envie sua foto** → Tire com a câmera ou escolha da galeria
4. **Remoção automática de fundo** → API gratuita do Remove.bg
5. **Confirme e salve** → "A foto ficou boa?" → salva em alta resolução na galeria

A imagem é gerada com deslocamento lateral para evitar que o rosto cubra o buraco da câmera do celular.

## Instalação

### Pré-requisitos
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go no celular (para testar) ou Xcode/Android Studio

### Setup

```bash
# Clone o repositório
git clone https://github.com/carloshora/rhora.git
cd rhora

# Instale dependências
npm install

# Configure sua API key do Remove.bg
cp .env.example .env
# Edite .env e coloque sua EXPO_PUBLIC_REMOVEBG_API_KEY
# OU configure diretamente no app em Configurações

# Inicie
npx expo start
```

### API Key gratuita (Remove.bg)

1. Acesse https://www.remove.bg/api
2. Crie uma conta gratuita
3. Copie sua API key (50 imagens/mês grátis)
4. No app: abra **Configurações** e cole a chave

## Tamanhos de saída (prontos para impressão)

| Modelo | Resolução | DPI |
|---|---|---|
| iPhone 12/13/14 | 843 × 1844 px | 300 |
| iPhone 15/16 Pro Max | 968 × 2008 px | 300 |
| Samsung S25/S25+ | 905 × 1902 px | 300 |
| Android Genérico | 850 × 1890 px | 300 |

## Design

Baseado na figurinha oficial **Panini FIFA World Cup 2026**, paleta da **Seleção Brasileira**.

- Fundo: Turquesa `#4ECDC4`
- Verde Brasil: `#009C3B`
- Amarelo Brasil: `#FFDF00`
- Painel inferior: `#1A8A82`

## Stack

- **React Native** (Expo ~52)
- **expo-image-picker** — câmera e galeria
- **expo-media-library** — salvar na galeria
- **react-native-view-shot** — captura de alta resolução
- **expo-linear-gradient** — gradientes de UI
- **Remove.bg API** — remoção de fundo (50/mês grátis)

## Roadmap

- [x] Brasil
- [ ] Seleções europeias (França, Alemanha, Espanha, Portugal, Inglaterra, Itália)
- [ ] América do Sul (Argentina, Colômbia, Uruguai)
- [ ] África (Marrocos, Senegal, Nigéria)
- [ ] Editor de posição da foto
- [ ] Compartilhar via WhatsApp

## Licença

MIT — Livre para usar, modificar e distribuir.
