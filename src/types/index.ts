export interface Match {
  idEvent: string;
  idLeague: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string;
  strTimestamp: string;
  strLeague: string;
  strThumb: string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  idHomeTeam: string;
  idAwayTeam: string;
  strVenue: string;
  strTime: string;
  dateEvent: string;
  intRound: string;
  homeAggScore?: string;
  awayAggScore?: string;
  homeTag?: string;
  awayTag?: string;
  homeCardColor?: "red" | "yellow";
  awayCardColor?: "red" | "yellow";
  strHomeScore?: string | null;
  strAwayScore?: string | null;
}

export interface MatchEvent {
  idTimeline: string;
  idEvent: string;
  strTimeline: string;
  strTimelineDetail: string;
  strHome: string;
  strPlayer: string;
  intTime: string;
  strTeam: string;
  idPlayer: string;
  strPlayerSubstitute?: string;
}

export interface MatchDetails extends Match {
  strDescriptionEN: string;
  strResult: string;
  strVideo: string;
  homeYellowCards?: number;
  homeRedCards?: number;
  awayYellowCards?: number;
  awayRedCards?: number;
}
