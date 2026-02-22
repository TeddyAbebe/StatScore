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

export interface MatchCardProps {
  match: Match;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export interface MatchHeroProps {
  matchDetails: MatchDetails;
}

export interface MatchTimelineProps {
  events: MatchEvent[];
  homeScore?: string | null;
  awayScore?: string | null;
  startTime?: string;
  isFinished?: boolean;
}

export interface DateScrollerProps {
  selectedDate: Date;
  onDateSelect: (date: string) => void;
  onCalendarClick: () => void;
}

export interface CalendarPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelect: (date: string) => void;
}

export interface LeagueGroup {
  name: string;
  matches: Match[];
}
