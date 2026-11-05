import { describe, expect, it } from 'vitest';
import { detectInstallPlatform } from './install-platform';

const IPHONE_SAFARI =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
const ANDROID_CHROME =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36';
const MAC_SAFARI =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15';
const WINDOWS_CHROME =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

describe('detectInstallPlatform', () => {
  it.each([
    { device: 'iPhone', userAgent: IPHONE_SAFARI, maxTouchPoints: 5, expected: 'ios' },
    {
      device: 'iPad asking for the desktop site',
      userAgent: MAC_SAFARI,
      maxTouchPoints: 5,
      expected: 'ios',
    },
    { device: 'Android phone', userAgent: ANDROID_CHROME, maxTouchPoints: 5, expected: 'android' },
    { device: 'Mac with a mouse', userAgent: MAC_SAFARI, maxTouchPoints: 0, expected: 'other' },
    { device: 'Windows computer', userAgent: WINDOWS_CHROME, maxTouchPoints: 0, expected: 'other' },
  ])('recognises $device', ({ userAgent, maxTouchPoints, expected }) => {
    expect(detectInstallPlatform({ userAgent, maxTouchPoints })).toBe(expected);
  });
});
