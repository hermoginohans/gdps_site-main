import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { CurrencyCode, CurrencyRate } from '../types';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  rates: Record<CurrencyCode, CurrencyRate>;
  formatPrice: (pricePhp: number) => string;
  convertPrice: (pricePhp: number) => number;
  currentRate: CurrencyRate;
  rateDate: string | null;
  checkedAt: string | null;
  refreshing: boolean;
  rateError: string;
  refreshRates: () => Promise<void>;
}

const RATES: Record<CurrencyCode, CurrencyRate> = {
  PHP: {
    code: 'PHP',
    symbol: '₱',
    rateToPhp: 1.0,
    name: 'Philippine Peso'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rateToPhp: 0.01594,
    name: 'US Dollar'
  },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToPhp: 0.01386 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateToPhp: 0.0119 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToPhp: 2.4958 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateToPhp: 0.02035 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateToPhp: 0.02241 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rateToPhp: 0.02228 },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', rateToPhp: 0.12513 },
  MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rateToPhp: 0.06514 },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rateToPhp: 283.37 }
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('PHP');
  const [rates, setRates] = useState(RATES);
  const [rateDate, setRateDate] = useState<string | null>(null);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [rateError, setRateError] = useState('');
  const inFlight = useRef(false);
  const refreshRates = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setRefreshing(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    try {
      const codes = (Object.keys(RATES) as CurrencyCode[]).filter(code => code !== 'PHP');
      const response = await fetch(`https://api.frankfurter.dev/v2/rates?base=PHP&quotes=${codes.join(',')}`, { signal: controller.signal });
      if (!response.ok) throw new Error('Rate provider unavailable');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid provider response');
      const next = { ...RATES };
      const dates: string[] = [];
      for (const code of codes) {
        const row = data.find(item => item.quote === code);
        if (!row || row.base !== 'PHP' || typeof row.rate !== 'number' || !Number.isFinite(row.rate) || row.rate <= 0 || typeof row.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(row.date) || !Number.isFinite(Date.parse(row.date))) throw new Error('Invalid provider response');
        next[code] = { ...RATES[code], rateToPhp: row.rate, date: row.date };
        dates.push(row.date);
      }
      setRates(next);
      dates.sort();
      setRateDate(dates[0] === dates[dates.length - 1] ? dates[0] : `${dates[0]} – ${dates[dates.length - 1]}`);
      setCheckedAt(new Date().toISOString());
      setRateError('');
    } catch {
      setRateError('Could not update exchange rates. The last loaded rate is retained; if none has loaded, the configured fallback is used.');
    } finally {
      window.clearTimeout(timeout);
      inFlight.current = false;
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshRates();
    const interval = window.setInterval(() => { void refreshRates(); }, 60 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [refreshRates]);

  useEffect(() => {
    const saved = localStorage.getItem('gpds_currency') as CurrencyCode;
    if (saved && RATES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('gpds_currency', code);
  };

  const convertPrice = (pricePhp: number): number => {
    const rate = rates[currency].rateToPhp;
    return pricePhp * rate;
  };

  const formatPrice = (pricePhp: number): string => {
    const targetAmount = convertPrice(pricePhp);
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency }).format(targetAmount);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        formatPrice,
        convertPrice,
        currentRate: rates[currency],
        rateDate, checkedAt, refreshing, rateError, refreshRates
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
