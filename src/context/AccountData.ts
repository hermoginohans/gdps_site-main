import { useEffect, useState } from 'react';
import { apiRequest, useAuth } from './AuthContext';
export function useAccountData() {
  const { user } = useAuth();
  const [data, setData] = useState<{balanceCentavos: number; orders: {id: number; number: string; status: string; amount_centavos: number}[]} | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; setData(null); if (user) apiRequest('/api/account').then(value => { if (active) setData(value); }).catch(e => { if (active) setError(e.message); }); return () => { active = false; }; }, [user?.id]);
  return { data, error };
}
