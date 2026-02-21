import { useState, useEffect, useCallback, useRef } from "react";
import { MatchDetails, MatchEvent } from "../types";
import {
  MOCK_MATCH_DETAILS,
  MOCK_EVENTS,
  MOCK_MATCHES,
} from "../data/mockData";

export const useMatchDetails = (id: string | undefined) => {
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const details = MOCK_MATCH_DETAILS[id];
      if (details) {
        setMatchDetails(details);
        setEvents(MOCK_EVENTS[id] ?? []);
      } else {
        const fromList = MOCK_MATCHES.find((m) => m.idEvent === id);
        if (fromList) {
          const basic: MatchDetails = {
            ...fromList,
            strDescriptionEN: "",
            strResult:
              fromList.intHomeScore != null && fromList.intAwayScore != null
                ? `${fromList.intHomeScore}-${fromList.intAwayScore}`
                : "",
            strVideo: "",
          };
          setMatchDetails(basic);
          setEvents([]);
        } else {
          setError("Match details not found in database.");
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError("An error occurred while fetching match data.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDetails]);

  return { matchDetails, events, loading, error, refetch: fetchDetails };
};
