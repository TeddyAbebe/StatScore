import { useParams, Link } from "react-router-dom";
import { useMatchDetails } from "../hooks/useMatchDetails";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { format, parseISO } from "date-fns";

// ─── Team Badge ───────────────────────────────────────────────────────────────
const TeamBadge = ({
  src,
  name,
  size = 52,
}: {
  src?: string;
  name?: string;
  size?: number;
}) => {
  const [errored, setErrored] = useState(false);
  const dim = `${size}px`;
  if (src && !errored) {
    return (
      <img
        src={src}
        alt={name || ""}
        style={{ width: dim, height: dim }}
        className="object-contain drop-shadow-lg"
        onError={() => setErrored(true)}
      />
    );
  }
  return (
    <div
      style={{ width: dim, height: dim }}
      className="rounded-xl bg-white/10 flex items-center justify-center font-black text-white/30 text-xl"
    >
      {name?.charAt(0)}
    </div>
  );
};

// ─── Card rectangle icon ──────────────────────────────────────────────────────
const CardRect = ({ color }: { color: "yellow" | "red" }) => (
  <span
    className={`inline-block w-[8px] h-[11px] rounded-[1.5px] shrink-0 ${
      color === "yellow" ? "bg-[#FBBD23]" : "bg-[#FF4B4B]"
    }`}
  />
);

// ─── Corner flag icon (small "P") ─────────────────────────────────────────────
const CornerFlag = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <rect
      x="1"
      y="1"
      width="2"
      height="9"
      rx="1"
      fill="white"
      fillOpacity="0.25"
    />
    <path d="M3 1.5 L10 4 L3 6.5 Z" fill="white" fillOpacity="0.25" />
  </svg>
);

// ─── Sub arrows ──────────────────────────────────────────────────────────────
const SubArrows = () => (
  <div className="flex flex-col gap-px shrink-0">
    <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
      <path d="M4.5 0 L9 6 L0 6 Z" fill="#00ffa2" />
    </svg>
    <svg width="9" height="6" viewBox="0 0 9 6" fill="none">
      <path d="M4.5 6 L9 0 L0 0 Z" fill="#FF4B4B" />
    </svg>
  </div>
);

// ─── Event classification ─────────────────────────────────────────────────────
type EventKind =
  | "goal"
  | "card-yellow"
  | "card-red"
  | "sub"
  | "corner"
  | "injury"
  | "shot"
  | "other";

const classify = (type?: string, detail?: string): EventKind => {
  const t = type?.toLowerCase() ?? "";
  const d = detail?.toLowerCase() ?? "";
  if (t === "goal") return "goal";
  if (t === "card" && d.includes("red")) return "card-red";
  if (t === "card") return "card-yellow";
  if (t === "substitution") return "sub";
  if (t === "corner") return "corner";
  if (t === "injury") return "injury";
  if (t === "shot") return "shot";
  return "other";
};

// ─── Center time node ─────────────────────────────────────────────────────────
const TimeNode = ({
  time,
  kind,
  isHome,
}: {
  time: string;
  kind: EventKind;
  isHome: boolean;
}) => {
  if (kind === "goal") {
    return (
      <div className="w-[50px] h-[24px] bg-[#00ffa2] rounded-full flex items-center justify-center text-[11px] font-black text-[#0F111A] shadow-[0_0_14px_rgba(0,255,162,0.5)] shrink-0">
        {time}'
      </div>
    );
  }

  let icon: React.ReactNode = null;
  if (kind === "card-yellow") icon = <CardRect color="yellow" />;
  else if (kind === "card-red") icon = <CardRect color="red" />;
  else if (kind === "sub") icon = <SubArrows />;
  else if (kind === "corner") icon = <CornerFlag />;

  return (
    <div
      className={`flex items-center gap-1 shrink-0 ${isHome ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="w-[36px] h-[19px] rounded-full bg-[#1d1e2b] border border-white/8 flex items-center justify-center text-[10px] font-bold text-white/35 shrink-0">
        {time}'
      </div>
      {icon}
    </div>
  );
};

// ─── Single event row ─────────────────────────────────────────────────────────
interface EvtRowProps {
  time: string;
  kind: EventKind;
  player: string;
  subPlayer?: string;
  isHome: boolean;
}

const EvtRow = ({ time, kind, player, subPlayer, isHome }: EvtRowProps) => {
  // For corner events show the label on the opposite side
  const isCorner = kind === "corner";

  return (
    <div
      className={`flex items-center w-full min-h-[38px] ${isHome ? "flex-row" : "flex-row-reverse"}`}
    >
      {/* Player column — home=left, away=right */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${isHome ? "items-start pr-3" : "items-end pl-3"}`}
      >
        {!isCorner && (
          <>
            <span className="text-[12.5px] font-semibold text-white/85 leading-tight truncate max-w-full">
              {player}
            </span>
            {subPlayer && (
              <span
                className={`text-[11px] leading-tight truncate max-w-full mt-0.5 ${
                  kind === "card-red" ? "text-[#FF4B4B]/60" : "text-white/35"
                }`}
              >
                {subPlayer}
              </span>
            )}
          </>
        )}
      </div>

      {/* Center time node */}
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ width: 90 }}
      >
        <TimeNode time={time} kind={kind} isHome={isHome} />
      </div>

      {/* Opposite column — corner label goes here; others empty */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${isHome ? "items-end pl-3" : "items-start pr-3"}`}
      >
        {isCorner && (
          <span className="text-[11px] font-semibold text-white/40 leading-tight truncate max-w-full">
            {player}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const MatchDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { matchDetails, events, loading, error } = useMatchDetails(id);
  const [activeTab, setActiveTab] = useState("Events");

  const TABS = ["Details", "Odds", "Lineups", "Events", "Stats", "Standings"];

  const isFinished =
    matchDetails?.strStatus === "FT" || matchDetails?.strStatus === "Finished";
  const isLive =
    matchDetails?.strStatus === "Started" ||
    matchDetails?.strStatus === "1H" ||
    matchDetails?.strStatus === "2H" ||
    matchDetails?.strStatus === "HT" ||
    matchDetails?.strStatus?.includes("'");

  const statusLabel = isFinished
    ? "Finished"
    : isLive
      ? matchDetails?.strStatus || "Live"
      : matchDetails?.strStatus || "—";

  const matchDate = matchDetails?.dateEvent
    ? (() => {
        try {
          return format(
            parseISO(matchDetails.dateEvent),
            "d MMM",
          ).toUpperCase();
        } catch {
          return matchDetails.dateEvent;
        }
      })()
    : "—";

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-[#181921]">
        <div className="w-10 h-10 border-[3px] border-[#00ffa2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Error / no data ──
  if (error || !matchDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8 bg-[#181921]">
        <p className="text-white/40 mb-6 text-[15px]">Match not found</p>
        <Link
          to="/matches"
          className="bg-[#6D00FF] text-white px-6 py-2.5 rounded-xl font-bold text-[14px] hover:bg-[#7a1aff] transition-colors"
        >
          Back to Matches
        </Link>
      </div>
    );
  }

  const allEvents = events.filter((e) => e.strTimeline !== "Assist");

  return (
    <div className="w-full bg-[#181921] min-h-screen text-white">
      <div className="bg-[#1d1e2b]">
        {/* ── Back + League name ── */}
        <div className="max-w-[860px] mx-auto px-4 pt-4 pb-2 flex items-center gap-2">
          <Link
            to="/matches"
            className="text-white/50 hover:text-white transition-colors p-0.5"
          >
            <ChevronLeft size={18} />
          </Link>
          <span className="text-[13px] font-semibold text-white/60">
            {matchDetails.strLeague}
          </span>
        </div>

        {/* ══════ Scoreboard hero ════ */}
        <section className="max-w-[860px] mx-auto px-6 pt-3 pb-5">
          <div className="flex items-center justify-between gap-2">
            {/* Home team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="relative">
                <TeamBadge
                  src={matchDetails.strHomeTeamBadge}
                  name={matchDetails.strHomeTeam}
                  size={60}
                />
                {/* Yellow card count badge — top-right */}
                {(matchDetails.homeYellowCards ?? 0) > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-[#FBBD23] rounded-[3px] flex items-center justify-center text-[10px] font-black text-black shadow">
                    {matchDetails.homeYellowCards}
                  </div>
                )}
              </div>
              <span className="text-[13px] font-bold text-white/85 text-center leading-tight max-w-[80px]">
                {matchDetails.strHomeTeam}
              </span>
            </div>

            {/* Score center */}
            <div className="flex flex-col items-center gap-1 shrink-0 px-1">
              <span className="text-[10px] font-bold text-white/25 tracking-[0.18em] mb-0.5">
                {matchDate}
              </span>
              <div className="flex items-center gap-2.5">
                <span className="text-[42px] font-black text-white leading-none tabular-nums">
                  {matchDetails.intHomeScore ?? "—"}
                </span>
                <span className="text-[26px] font-thin text-white/20 leading-none">
                  -
                </span>
                <span className="text-[42px] font-black text-white leading-none tabular-nums">
                  {matchDetails.intAwayScore ?? "—"}
                </span>
              </div>
              {/* Status pill — solid fill matching design */}
              <span
                className={`mt-0.5 px-3 py-[3px] text-[10px] font-bold rounded ${
                  isFinished
                    ? "bg-[#FF4B4B] text-white"
                    : isLive
                      ? "bg-[#00ffa2] text-[#181921] animate-pulse"
                      : "bg-white/10 text-white/50"
                }`}
              >
                {statusLabel}
              </span>
            </div>

            {/* Away team */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="relative">
                <TeamBadge
                  src={matchDetails.strAwayTeamBadge}
                  name={matchDetails.strAwayTeam}
                  size={60}
                />
                {/* Card count badges stacked — top-left */}
                <div className="absolute -top-1.5 -left-1.5 flex flex-row gap-[3px]">
                  {(matchDetails.awayYellowCards ?? 0) > 0 && (
                    <div className="w-[18px] h-[18px] bg-[#FBBD23] rounded-[3px] flex items-center justify-center text-[10px] font-black text-black shadow">
                      {matchDetails.awayYellowCards}
                    </div>
                  )}
                  {(matchDetails.awayRedCards ?? 0) > 0 && (
                    <div className="w-[18px] h-[18px] bg-[#FF4B4B] rounded-[3px] flex items-center justify-center text-[10px] font-black text-white shadow">
                      {matchDetails.awayRedCards}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[13px] font-bold text-white/85 text-center leading-tight max-w-[80px]">
                {matchDetails.strAwayTeam}
              </span>
            </div>
          </div>
        </section>

        {/* ══════ Tab bar ════ */}
        <div className="border-b border-white/6 max-w-[860px] mx-auto px-4">
          <nav className="flex items-center overflow-x-auto scrollbar-hide justify-between md:justify-start md:gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 pt-2 px-3 text-[14px] font-semibold whitespace-nowrap relative transition-colors ${
                  activeTab === tab
                    ? "text-white"
                    : "text-white/35 hover:text-white/60"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#00ffa2] rounded-t-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>{" "}
      {/* end hero card */}
      {/* ══════ Events tab ════ */}
      {activeTab === "Events" && (
        <section className="max-w-[580px] mx-auto px-4 pt-3 pb-5">
          <h2 className="text-[13px] font-bold text-white/70 mb-4">Events</h2>

          {allEvents.length === 0 ? (
            <p className="text-center text-white/25 text-[13px] py-14">
              No timeline events available
            </p>
          ) : (
            <div className="relative">
              {/* Vertical center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 pointer-events-none" />

              {/* Full time label */}
              <div className="flex justify-center mb-3 relative z-10">
                <span className="text-[10px] font-bold text-white/35 tracking-widest uppercase bg-[#181921] px-2">
                  Full time {matchDetails.intHomeScore} -{" "}
                  {matchDetails.intAwayScore}
                </span>
              </div>

              {/* Event rows */}
              <div className="flex flex-col gap-3">
                {allEvents.map((event, idx) => {
                  // ── Halftime divider ──
                  if (event.strTimeline === "Halftime") {
                    return (
                      <div
                        key={event.idTimeline || idx}
                        className="flex justify-center relative z-10 py-1"
                      >
                        <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase bg-[#181921] px-2">
                          Half time {event.strPlayer}
                        </span>
                      </div>
                    );
                  }

                  const isHome = event.strHome === "Yes";
                  const kind = classify(
                    event.strTimeline,
                    event.strTimelineDetail,
                  );

                  return (
                    <EvtRow
                      key={event.idTimeline || idx}
                      time={event.intTime}
                      kind={kind}
                      player={event.strPlayer}
                      subPlayer={event.strPlayerSubstitute || undefined}
                      isHome={isHome}
                    />
                  );
                })}
              </div>

              {/* Kick off footer */}
              <div className="flex justify-center mt-6 relative z-10">
                <span className="text-[10px] font-bold text-white/20 tracking-widest uppercase bg-[#181921] px-2">
                  Kick Off -{matchDetails.strTime?.substring(0, 5) || "—"}
                </span>
              </div>
            </div>
          )}
        </section>
      )}
      {/* ══════ Other tabs placeholder ══════ */}
      {activeTab !== "Events" && (
        <div className="max-w-[860px] mx-auto px-4 py-20 text-center">
          <p className="text-white/20 text-[13px]">{activeTab} — coming soon</p>
        </div>
      )}
    </div>
  );
};

export default MatchDetailsPage;
