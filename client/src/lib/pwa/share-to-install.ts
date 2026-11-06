const USER_CANCELLED_ERROR = 'AbortError';

interface ShareTarget {
  title: string;
  url: string;
}

export async function openShareSheet(target: ShareTarget): Promise<boolean> {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false;
  }
  try {
    await navigator.share(target);
    return true;
  } catch (error) {
    return error instanceof DOMException && error.name === USER_CANCELLED_ERROR;
  }
}
