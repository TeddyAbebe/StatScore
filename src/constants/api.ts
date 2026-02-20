export const API_BASE_URL = "https://www.thesportsdb.com/api/v1/json/133602";
export const PREMIER_LEAGUE_ID = "4328";

export const ROUTES = {
  DASHBOARD: "/matches",
  MATCH_DETAILS: (id: string) => `/match/${id}`,
};
