import { useState, useEffect } from "react";
import { Match } from "../types";
import { MOCK_MATCHES } from "../data/mockData";

interface UseMatchesParams {
  date?: string;
  leagueId?: string;
  teamId?: string;
}

export const useMatches = (_params: UseMatchesParams) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setMatches(MOCK_MATCHES);
      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, []);

  return { matches, loading, error: null, refetch: () => {} };
};
