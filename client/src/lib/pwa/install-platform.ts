export type InstallPlatform = 'ios' | 'android' | 'other';

export interface InstallInstructions {
  title: string;
  steps: string[];
}

interface DeviceHints {
  userAgent: string;
  maxTouchPoints: number;
}

const IOS_PATTERN = /iPhone|iPad|iPod/;
const ANDROID_PATTERN = /Android/;
const MAC_PATTERN = /Macintosh/;

export function detectInstallPlatform({ userAgent, maxTouchPoints }: DeviceHints): InstallPlatform {
  const isIpadInDesktopMode = MAC_PATTERN.test(userAgent) && maxTouchPoints > 1;
  if (IOS_PATTERN.test(userAgent) || isIpadInDesktopMode) {
    return 'ios';
  }
  return ANDROID_PATTERN.test(userAgent) ? 'android' : 'other';
}

export const INSTALL_INSTRUCTIONS: Record<InstallPlatform, InstallInstructions> = {
  ios: {
    title: 'Instalar no iPhone ou iPad',
    steps: [
      'No Safari, toque no botão Compartilhar (o quadrado com a seta para cima, na barra do navegador).',
      'Role as opções para baixo e toque em “Adicionar à Tela de Início”.',
      'Toque em “Adicionar”. O app JOCEV’S aparece na sua tela inicial.',
    ],
  },
  android: {
    title: 'Instalar no Android',
    steps: [
      'Abra o menu do navegador (os três pontinhos).',
      'Toque em “Instalar app” ou “Adicionar à tela inicial”.',
      'Confirme em “Instalar”.',
      'Se o app já estiver instalado neste aparelho, abra-o pela tela inicial.',
    ],
  },
  other: {
    title: 'Instalar no computador',
    steps: [
      'No Chrome ou no Edge, clique no ícone de instalar na barra de endereço.',
      'Se ele não aparecer, abra o menu do navegador e procure “Instalar app”.',
    ],
  },
};
