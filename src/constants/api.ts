export const API_BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";
export const PREMIER_LEAGUE_ID = "133602";

export const ROUTES = {
  DASHBOARD: "/matches",
  MATCH_DETAILS: (id: string) => `/match/${id}`,
};
