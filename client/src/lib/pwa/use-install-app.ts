'use client';

import { useSyncExternalStore } from 'react';
import { detectInstallPlatform, type InstallPlatform } from './install-platform';
import {
  promptInstall,
  readInstallStatus,
  readServerInstallStatus,
  subscribeToInstallStatus,
  type InstallStatus,
} from './install-prompt-store';

export interface InstallApp {
  status: InstallStatus;
  platform: InstallPlatform;
  install: () => Promise<void>;
}

function subscribeToNothing(): () => void {
  return () => undefined;
}

function readPlatform(): InstallPlatform {
  return detectInstallPlatform({
    userAgent: navigator.userAgent,
    maxTouchPoints: navigator.maxTouchPoints,
  });
}

function readServerPlatform(): InstallPlatform {
  return 'other';
}

export function useInstallApp(): InstallApp {
  const status = useSyncExternalStore(
    subscribeToInstallStatus,
    readInstallStatus,
    readServerInstallStatus,
  );
  const platform = useSyncExternalStore(subscribeToNothing, readPlatform, readServerPlatform);
  return { status, platform, install: promptInstall };
}
