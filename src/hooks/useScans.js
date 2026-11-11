import { useCallback, useEffect, useState } from 'react';
import { scanRepository } from '../services/scanRepository';

export function useScans() {
  const [state, setState] = useState({ status: 'loading', scans: [], error: null });

  const load = useCallback(async () => {
    try {
      const scans = await scanRepository.list();
      setState({ status: 'ready', scans, error: null });
    } catch (error) {
      setState({ status: 'error', scans: [], error });
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { ...state, reload: load };
}
