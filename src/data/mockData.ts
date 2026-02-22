import { Match, MatchDetails, MatchEvent } from "../types";

const BADGES: Record<string, string> = {
  Arsenal: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  Chelsea: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
  Liverpool: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
  "Manchester City":
    "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  "Manchester United":
    "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  Tottenham:
    "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
  Newcastle:
    "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg",
  "Aston Villa":
    "https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest.svg",
  "West Ham":
    "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg",
  Brighton:
    "https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg",
  Everton: "https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg",
  Brentford:
    "https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg",
  "Crystal Palace":
    "https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo.svg",
  Fulham:
    "https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg",
  Wolves:
    "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg",
  Bournemouth:
    "https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg",
  "Nottingham Forest":
    "https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg",
  Leicester: "https://upload.wikimedia.org/wikipedia/en/6/63/Leicester02.png",
  "Leeds United":
    "https://upload.wikimedia.org/wikipedia/en/5/54/Leeds_United_F.C._logo.svg",
  Burnley: "https://upload.wikimedia.org/wikipedia/en/6/63/Burnley_FC_Logo.svg",

  "Real Madrid":
    "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
  Barcelona:
    "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  "Bayern Munich":
    "https://upload.wikimedia.org/wikipedia/en/1/1f/FC_Bayern_München_logo.svg",
  PSG: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
  Juventus: "https://upload.wikimedia.org/wikipedia/en/d/d2/Juventus_Logo.svg",
  "Inter Milan":
    "https://upload.wikimedia.org/wikipedia/en/0/05/FC_Internazionale_Milano_2021.svg",
  "AC Milan":
    "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg",
  "Atletico Madrid":
    "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg",
  "Borussia Dortmund":
    "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
  "RB Leipzig":
    "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg",
  Napoli: "https://upload.wikimedia.org/wikipedia/commons/2/2d/SSC_Napoli.svg",
  Benfica: "https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg",
  Porto: "https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg",
  Ajax: "https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg",
  Celtic: "https://upload.wikimedia.org/wikipedia/en/3/35/Celtic_FC.svg",
  Galatasaray:
    "https://upload.wikimedia.org/wikipedia/commons/7/7a/Galatasaray_Sports_Club_Logo.svg",
  Marseille:
    "https://upload.wikimedia.org/wikipedia/en/2/2b/Olympique_Marseille_logo.svg",
  Monaco: "https://upload.wikimedia.org/wikipedia/en/b/ba/AS_Monaco_FC.svg",
  Sevilla: "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg",
  "Sporting CP":
    "https://upload.wikimedia.org/wikipedia/en/e/e1/Sporting_Clube_de_Portugal_logo.svg",
  Valencia: "https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg",
};

const TODAY = new Date().toISOString().split("T")[0];
const TEAMS = Object.keys(BADGES);

export const MOCK_MATCHES: Match[] = [];

MOCK_MATCHES.push({
  idEvent: "design-1",
  idLeague: "4480",
  strLeague: "UEFA Champions League",
  strEvent: "Arsenal vs Valencia",
  strHomeTeam: "Arsenal",
  strAwayTeam: "Valencia",
  intHomeScore: "2",
  intAwayScore: "1",
  homeAggScore: "2",
  awayAggScore: "0",
  homeTag: "AGG",
  strStatus: "FT",
  strTimestamp: new Date().toISOString(),
  strThumb: "",
  strHomeTeamBadge: BADGES["Arsenal"],
  strAwayTeamBadge: BADGES["Valencia"],
  idHomeTeam: "h-arsenal",
  idAwayTeam: "h-valencia",
  strVenue: "Emirates Stadium",
  strTime: "20:00:00",
  dateEvent: TODAY,
  intRound: "Quarter-Final",
});

MOCK_MATCHES.push({
  idEvent: "design-2",
  idLeague: "4480",
  strLeague: "UEFA Champions League",
  strEvent: "Real Madrid vs Barcelona",
  strHomeTeam: "Real Madrid",
  strAwayTeam: "Barcelona",
  intHomeScore: "1",
  intAwayScore: "3",
  homeAggScore: "3",
  awayAggScore: "1",
  homeCardColor: "red",
  awayTag: "PEN",
  strStatus: "FT",
  strTimestamp: new Date().toISOString(),
  strThumb: "",
  strHomeTeamBadge: BADGES["Real Madrid"],
  strAwayTeamBadge: BADGES["Barcelona"],
  idHomeTeam: "h-madrid",
  idAwayTeam: "h-barcelona",
  strVenue: "Santiago Bernabéu",
  strTime: "20:00:00",
  dateEvent: TODAY,
  intRound: "Quarter-Final",
});

for (let i = 0; i < 28; i++) {
  const homeTeam = TEAMS[(i + 5) % TEAMS.length];
  const awayTeam = TEAMS[(i + 12) % TEAMS.length];

  const isLive = i < 3;
  const isFT = i >= 3 && i < 10;

  MOCK_MATCHES.push({
    idEvent: `m-${i}`,
    idLeague: i % 2 === 0 ? "133602" : "4480",
    strLeague: i % 2 === 0 ? "Premier League" : "Champions League",
    strEvent: `${homeTeam} vs ${awayTeam}`,
    strHomeTeam: homeTeam,
    strAwayTeam: awayTeam,
    intHomeScore: isLive || isFT ? (i % 3).toString() : null,
    intAwayScore: isLive || isFT ? (i % 2).toString() : null,
    strStatus: isLive ? "72'" : isFT ? "FT" : "NS",
    strTimestamp: new Date().toISOString(),
    strThumb: "",
    strHomeTeamBadge: BADGES[homeTeam],
    strAwayTeamBadge: BADGES[awayTeam],
    idHomeTeam: `h-${i}`,
    idAwayTeam: `a-${i}`,
    strVenue: "National Stadium",
    strTime: "13:00:00",
    dateEvent: TODAY,
    intRound: "15",
  });
}

export const MOCK_MATCH_DETAILS: Record<string, MatchDetails> = {};
export const MOCK_EVENTS: Record<string, MatchEvent[]> = {};

MOCK_MATCHES.forEach((m) => {
  MOCK_MATCH_DETAILS[m.idEvent] = {
    ...m,
    strDescriptionEN: `Welcome to the big match between ${m.strHomeTeam} and ${m.strAwayTeam}.`,
    strResult:
      m.intHomeScore !== null ? `${m.intHomeScore}-${m.intAwayScore}` : "",
    strVideo: "",
    homeYellowCards: m.idEvent === "design-1" ? 1 : 0,
    homeRedCards: m.idEvent === "design-2" ? 1 : 0,
    awayYellowCards: m.idEvent === "design-1" ? 2 : 0,
    awayRedCards: 0,
  };

  if (m.intHomeScore !== null) {
    MOCK_EVENTS[m.idEvent] = [
      {
        idTimeline: "1",
        idEvent: m.idEvent,
        strTimeline: "Goal",
        strTimelineDetail: "Goal",
        strHome: "Yes",
        strPlayer: "Saka",
        intTime: "15",
        strTeam: m.strHomeTeam,
        idPlayer: "p1",
      },
      {
        idTimeline: "2",
        idEvent: m.idEvent,
        strTimeline: "Card",
        strTimelineDetail: "Yellow Card",
        strHome: "No",
        strPlayer: "Rodri",
        intTime: "34",
        strTeam: m.strAwayTeam,
        idPlayer: "p2",
      },
      {
        idTimeline: "3",
        idEvent: m.idEvent,
        strTimeline: "Goal",
        strTimelineDetail: "Penalty",
        strHome: "No",
        strPlayer: "Haaland",
        intTime: "62",
        strTeam: m.strAwayTeam,
        idPlayer: "p3",
      },
      {
        idTimeline: "4",
        idEvent: m.idEvent,
        strTimeline: "Substitution",
        strTimelineDetail: "In: Martinelli, Out: Trossard",
        strHome: "Yes",
        strPlayer: "Martinelli",
        strPlayerSubstitute: "Trossard",
        intTime: "65",
        strTeam: m.strHomeTeam,
        idPlayer: "p4",
      },
      {
        idTimeline: "5",
        idEvent: m.idEvent,
        strTimeline: "Corner",
        strTimelineDetail: "Corner",
        strHome: "Yes",
        strPlayer: "White",
        intTime: "88",
        strTeam: m.strHomeTeam,
        idPlayer: "p5",
      },
    ];
  }
});
