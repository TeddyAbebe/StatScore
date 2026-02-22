import { Match } from "../types";

export const checkIfLive = (status: string | undefined): boolean => {
  if (!status) return false;
  const s = status.toLowerCase();
  return (
    ["started", "1h", "2h", "ht", "live"].includes(s) || status.includes("'")
  );
};

export const checkIfFinished = (status: string | undefined): boolean => {
  if (!status) return false;
  const s = status.toLowerCase();
  return ["ft", "finished", "aet", "pen"].includes(s);
};

export const getStatusDisplay = (match: Match): string => {
  const isLive = checkIfLive(match.strStatus);
  const isFinished = checkIfFinished(match.strStatus);

  if (isLive) {
    if (match.strStatus === "HT") return "HT";
    if (match.strStatus?.includes("'")) return match.strStatus;
    return "1H";
  }

  if (isFinished) return "FT";

  return match.strTime?.substring(0, 5) || "—";
};

export const filterLiveMatches = (matches: Match[]): Match[] => {
  return matches.filter((m) => checkIfLive(m.strStatus));
};

export const groupMatchesByLeague = (matches: Match[]) => {
  const leaguesMap: { [key: string]: Match[] } = {};

  matches.forEach((m) => {
    const name = m.strLeague || "Other League";
    if (!leaguesMap[name]) leaguesMap[name] = [];
    leaguesMap[name].push(m);
  });

  return Object.entries(leaguesMap).map(([name, matches]) => ({
    name,
    matches,
  }));
};
