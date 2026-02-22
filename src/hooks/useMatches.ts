import { useState, useEffect, useCallback, useRef } from "react";
import { Match } from "../types";
import { MOCK_MATCHES } from "../data/mockData";

interface UseMatchesParams {
  date?: string;
  leagueId?: string;
  teamId?: string;
}

export const useMatches = (params: UseMatchesParams) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const abortControllerRef = useRef<AbortController | null>(null);
  const offsetRef = useRef(0);
  const LIMIT = 5;

  const fetchMatches = useCallback(
    async (isInitial = true) => {
      if (isInitial) {
        setLoading(true);
        offsetRef.current = 0;
      } else {
        setLoadingMore(true);
      }

      setError(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(resolve, isInitial ? 600 : 1000);
          abortControllerRef.current?.signal.addEventListener("abort", () => {
            clearTimeout(timeout);
            reject(new DOMException("Aborted", "AbortError"));
          });
        });

        let allResults = [...MOCK_MATCHES];

        if (params.leagueId) {
          allResults = allResults.filter((m) => m.idLeague === params.leagueId);
        }
        if (params.date) {
          allResults = allResults.filter((m) => m.dateEvent === params.date);
        }
        if (params.teamId) {
          allResults = allResults.filter(
            (m) =>
              m.idHomeTeam === params.teamId || m.idAwayTeam === params.teamId,
          );
        }

        const currentOffset = offsetRef.current;
        const paginatedResults = allResults.slice(
          currentOffset,
          currentOffset + LIMIT,
        );

        if (isInitial) {
          setMatches(paginatedResults);
        } else {
          setMatches((prev) => [...prev, ...paginatedResults]);
        }

        const nextOffset = currentOffset + LIMIT;
        offsetRef.current = nextOffset;
        setHasMore(nextOffset < allResults.length);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError("Failed to synchronize match data.");
        }
      } finally {
        if (isInitial) setLoading(false);
        else setLoadingMore(false);
      }
    },
    [params.date, params.leagueId, params.teamId],
  );

  useEffect(() => {
    fetchMatches(true);

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchMatches]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    fetchMatches(false);
  }, [fetchMatches, loadingMore, hasMore]);

  return {
    matches,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch: () => fetchMatches(true),
  };
};
