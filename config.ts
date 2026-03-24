// Central runtime feature toggles.
// Set VITE_DEMO_MODE=false before production build to disable demo bypass logic.
const envDemo = import.meta.env.VITE_DEMO_MODE;

export const DEMO_MODE = envDemo === undefined ? true : envDemo === 'true';

export const STORAGE_KEYS = {
  quotes: 'britons_saved_quotes',
} as const;
