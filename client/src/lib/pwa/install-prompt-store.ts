import { EARLY_PROMPT_KEY } from './early-install-capture';

export type InstallStatus = 'checking' | 'installed' | 'promptable' | 'manual';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type Listener = () => void;

const STANDALONE_QUERY = '(display-mode: standalone)';

const listeners = new Set<Listener>();
let deferredPrompt: BeforeInstallPromptEvent | null = readEarlyPrompt();
let wasInstalled = false;

function readEarlyPrompt(): BeforeInstallPromptEvent | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const early = (window as unknown as Record<string, unknown>)[EARLY_PROMPT_KEY];
  return (early as BeforeInstallPromptEvent | undefined) ?? null;
}

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

function rememberPrompt(event: Event): void {
  event.preventDefault();
  deferredPrompt = event as BeforeInstallPromptEvent;
  notifyListeners();
}

function rememberInstalled(): void {
  wasInstalled = true;
  deferredPrompt = null;
  notifyListeners();
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', rememberPrompt);
  window.addEventListener('appinstalled', rememberInstalled);
}

function isRunningAsInstalledApp(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || window.matchMedia(STANDALONE_QUERY).matches;
}

export function subscribeToInstallStatus(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function readInstallStatus(): InstallStatus {
  if (wasInstalled || isRunningAsInstalledApp()) {
    return 'installed';
  }
  return deferredPrompt ? 'promptable' : 'manual';
}

export function readServerInstallStatus(): InstallStatus {
  return 'checking';
}

export async function promptInstall(): Promise<void> {
  const prompt = deferredPrompt;
  if (!prompt) {
    return;
  }
  await prompt.prompt();
  await prompt.userChoice;
  deferredPrompt = null;
  notifyListeners();
}
