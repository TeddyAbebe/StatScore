import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    const t = setTimeout(() => {
      const details = MOCK_MATCH_DETAILS[id];
      if (details) {
        setMatchDetails(details);
        setEvents(MOCK_EVENTS[id] ?? []);
        setLoading(false);
        return;
      }

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
        setError("Match not found");
      }

      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, [id]);

  return { matchDetails, events, loading, error };
};
