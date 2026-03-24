import { DEMO_MODE, STORAGE_KEYS } from './config';

export interface Message {
  id: string;
  text: string;
  sender: 'client' | 'agent';
  timestamp: string;
}

export interface CustomsItem {
  id: string;
  description: string;
  value: string;
  boxNumber?: string;
}

export interface SavedQuote {
  ref: string;
  email: string;
  volume: number;
  price: number;
  date: string;
  status: string;
  origin: string;
  destination: string;
  moveType?: string;
  extras?: string[];
  propertySize?: string;
  timestamp?: number;
  customsList?: CustomsItem[];
  messages?: Message[];
}

const getDemoQuotes = (): SavedQuote[] => {
  const raw = localStorage.getItem(STORAGE_KEYS.quotes);
  return JSON.parse(raw || '[]');
};

const setDemoQuotes = (quotes: SavedQuote[]) => {
  localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes));
};

export const quoteStore = {
  getAll: async (): Promise<SavedQuote[]> => {
    if (DEMO_MODE) return getDemoQuotes();

    const res = await fetch('/api/quotes', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to load quotes from API');
    return res.json();
  },

  create: async (quote: SavedQuote): Promise<void> => {
    if (DEMO_MODE) {
      const quotes = getDemoQuotes();
      quotes.push(quote);
      setDemoQuotes(quotes);
      return;
    }

    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(quote),
    });

    if (!res.ok) throw new Error('Failed to create quote via API');
  },

  upsert: async (updatedQuote: SavedQuote): Promise<void> => {
    if (DEMO_MODE) {
      const allQuotes = getDemoQuotes();
      const exists = allQuotes.some(q => q.ref === updatedQuote.ref);
      const newQuotes = exists
        ? allQuotes.map(q => (q.ref === updatedQuote.ref ? updatedQuote : q))
        : [...allQuotes, updatedQuote];
      setDemoQuotes(newQuotes);
      return;
    }

    const res = await fetch(`/api/quotes/${encodeURIComponent(updatedQuote.ref)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updatedQuote),
    });

    if (!res.ok) throw new Error('Failed to update quote via API');
  },

  replaceAll: async (quotes: SavedQuote[]): Promise<void> => {
    if (DEMO_MODE) {
      setDemoQuotes(quotes);
      return;
    }

    const res = await fetch('/api/quotes/bulk', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(quotes),
    });

    if (!res.ok) throw new Error('Failed to bulk replace quotes via API');
  },
};
