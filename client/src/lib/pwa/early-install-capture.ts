export const EARLY_PROMPT_KEY = '__earlyInstallPrompt';

export const EARLY_CAPTURE_SCRIPT = `window.addEventListener('beforeinstallprompt',function(event){event.preventDefault();window.${EARLY_PROMPT_KEY}=event;});`;
