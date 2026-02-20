import { API_BASE_URL } from "../constants/api";

export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
  strLeague: string;
}

export interface Player {
  idPlayer: string;
  strPlayer: string;
  strThumb: string;
  strPosition: string;
}

export interface SearchResult {
  teams: Team[] | null;
  players: Player[] | null;
}

export const searchTeams = async (query: string): Promise<Team[]> => {
  if (!query) return [];
  try {
    const response = await fetch(
      `${API_BASE_URL}/searchteams.php?t=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    return data.teams || [];
  } catch (error) {
    console.error("Error searching teams:", error);
    return [];
  }
};

export const searchPlayers = async (query: string): Promise<Player[]> => {
  if (!query) return [];
  try {
    const response = await fetch(
      `${API_BASE_URL}/searchplayers.php?p=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    return data.players || [];
  } catch (error) {
    console.error("Error searching players:", error);
    return [];
  }
};

export const getTeamNextEvents = async (teamId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/eventsnext.php?id=${teamId}`);
    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error("Error fetching next events:", error);
    return [];
  }
};

export const getTeamLastEvents = async (teamId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/eventslast.php?id=${teamId}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching last events:", error);
    return [];
  }
};
