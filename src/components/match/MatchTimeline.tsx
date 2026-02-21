import { MatchEvent } from "../../types";

type EventKind =
  | "goal"
  | "card-yellow"
  | "card-red"
  | "sub"
  | "corner"
  | "penalty"
  | "injury"
  | "other";

const classify = (type?: string, detail?: string): EventKind => {
  const t = type?.toLowerCase() ?? "";
  const d = detail?.toLowerCase() ?? "";

  if (d.includes("penalty")) return "penalty";
  if (t === "goal") return "goal";
  if (t === "card" && d.includes("red")) return "card-red";
  if (t === "card") return "card-yellow";
  if (t.includes("substitution")) return "sub";
  if (t.includes("corner")) return "corner";
  if (t === "injury") return "injury";
  return "other";
};

const CardRect = ({ color }: { color: "yellow" | "red" }) => (
  <span
    className={`inline-block w-[7px] h-[10px] rounded-[1.5px] shrink-0 ${color === "yellow" ? "bg-[#FBBD23]" : "bg-[#FF4B4B]"}`}
  />
);

const SubIcon = () => (
  <div className="flex flex-col gap-px shrink-0">
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
      <path d="M4 0 L8 5 L0 5 Z" fill="#00ffa2" />
    </svg>
    <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
      <path d="M4 5 L8 0 L0 0 Z" fill="#FF4B4B" />
    </svg>
  </div>
);

const CornerIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    className="text-white/40"
  >
    <path
      d="M5 21V3H19L15 7L19 11H5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TimeBadge = ({ time, kind }: { time: string; kind: EventKind }) => {
  if (kind === "goal" || kind === "penalty") {
    return (
      <div className="flex items-center justify-center">
        <div
          className={`h-[22px] px-3 ${kind === "penalty" ? "bg-[#FBBD23] text-black" : "bg-accent text-[#0F111A]"} rounded-full flex items-center justify-center text-[10px] font-black shadow-[0_0_14px_rgba(0,255,162,0.3)] whitespace-nowrap shrink-0`}
        >
          {time}' {kind === "penalty" && "PEN"}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-1.5 shrink-0">
      <span className="text-[11px] font-bold text-white/25 whitespace-nowrap tabular-nums">
        {time}'
      </span>
      {kind === "card-yellow" && <CardRect color="yellow" />}
      {kind === "card-red" && <CardRect color="red" />}
      {kind === "sub" && <SubIcon />}
      {kind === "corner" && <CornerIcon />}
    </div>
  );
};

const PlayerCell = ({
  player,
  subPlayer,
  kind,
  align,
}: {
  player: string;
  subPlayer?: string;
  kind: EventKind;
  align: "left" | "right";
}) => {
  const textAlign =
    align === "left" ? "items-end text-right" : "items-start text-left";
  return (
    <div className={`flex flex-col ${textAlign} min-w-0 flex-1`}>
      <span
        className={`leading-tight truncate max-w-full text-[12px] font-semibold ${kind === "penalty" ? "text-[#FBBD23]" : "text-white/80"}`}
      >
        {player}
      </span>
      {subPlayer && (
        <span
          className={`text-[9px] leading-tight truncate max-w-full mt-px ${kind === "card-red" ? "text-red-500/60" : kind === "sub" ? "text-accent/60" : "text-white/20"}`}
        >
          {subPlayer}
        </span>
      )}
    </div>
  );
};

interface MatchTimelineProps {
  events: MatchEvent[];
  homeScore: string | null;
  awayScore: string | null;
  startTime?: string;
  isFinished?: boolean;
}

export const MatchTimeline = ({
  events,
  homeScore,
  awayScore,
  startTime,
  isFinished,
}: MatchTimelineProps) => {
  const allEvents = events.filter((e) => e.strTimeline !== "Assist");

  if (allEvents.length === 0) {
    return (
      <p className="text-center text-white/25 text-[13px] py-14">
        No match events recorded yet
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 pointer-events-none" />

      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[10px] font-black text-white/20 whitespace-nowrap tracking-widest uppercase">
          {isFinished ? "Final Score" : "Live Score"}
          &nbsp;{homeScore} - {awayScore}
        </span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <div className="flex flex-col gap-[8px]">
        {allEvents.map((event, idx) => {
          if (event.strTimeline === "Halftime") {
            return (
              <div
                key={idx}
                className="flex items-center gap-3 my-4 relative z-10"
              >
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] font-black text-white/20 whitespace-nowrap tracking-widest uppercase">
                  HT &nbsp;{event.strPlayer}
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>
            );
          }

          const isHome = event.strHome === "Yes";
          const kind = classify(event.strTimeline, event.strTimelineDetail);

          return (
            <div
              key={idx}
              className="grid grid-cols-[1fr_80px_1fr] items-center min-h-[40px] gap-2"
            >
              <div className="flex justify-end pr-2">
                {isHome && (
                  <PlayerCell
                    player={event.strPlayer}
                    subPlayer={event.strPlayerSubstitute}
                    kind={kind}
                    align="left"
                  />
                )}
              </div>
              <div className="flex items-center justify-center">
                <TimeBadge time={event.intTime} kind={kind} />
              </div>
              <div className="flex justify-start pl-2">
                {!isHome && (
                  <PlayerCell
                    player={event.strPlayer}
                    subPlayer={event.strPlayerSubstitute}
                    kind={kind}
                    align="right"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mt-8 mb-4 relative z-10">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[10px] font-bold text-white/30 whitespace-nowrap tracking-widest uppercase">
          Kick Off - {startTime?.substring(0, 5) || "—"}
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>
    </div>
  );
};
