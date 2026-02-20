import { Link } from "react-router-dom";
import { MoreVertical, Heart, Bell, BarChart2, Share2, X } from "lucide-react";
import { Match } from "../types";
import { useState, useRef, useEffect } from "react";

interface MatchCardProps {
  match: Match;
}

const CardIcon = ({ color }: { color: "red" | "yellow" }) => (
  <span
    className={`inline-block w-[9px] h-[12px] rounded-[1.5px] shadow ml-1.5 shrink-0 ${
      color === "red" ? "bg-[#FF4B4B]" : "bg-[#FBBD23]"
    }`}
  />
);

const Tag = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-[2px] ml-1.5 px-1 py-px text-[8px] font-black leading-none rounded text-[#00ffa2] bg-[#00ffa2]/10 border border-[#00ffa2]/25 shrink-0 uppercase tracking-wide">
    <span className="text-[7px]">✓</span>
    {label}
  </span>
);

const MENU_ACTIONS = [
  { icon: Heart, label: "Add to Favorites", iconClass: "text-[#f87171]" },
  { icon: Bell, label: "Set Reminder", iconClass: "text-[#FBBD23]" },
  { icon: BarChart2, label: "View Statistics", iconClass: "text-[#3abff8]" },
  { icon: Share2, label: "Share Match", iconClass: "text-[#00ffa2]" },
];

const MatchCard = ({ match }: MatchCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    const timer = setTimeout(() => document.addEventListener("click", close), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", close);
    };
  }, [menuOpen]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen((v) => !v);
  };

  const isLive =
    match.strStatus === "Started" ||
    match.strStatus === "1H" ||
    match.strStatus === "2H" ||
    match.strStatus === "HT" ||
    match.strStatus?.includes("'") ||
    match.strStatus?.toLowerCase() === "live";

  const isFinished = match.strStatus === "FT" || match.strStatus === "Finished";

  const homeScore = match.intHomeScore;
  const awayScore = match.intAwayScore;
  const hasScore =
    homeScore !== null &&
    homeScore !== undefined &&
    awayScore !== null &&
    awayScore !== undefined;

  const getStatusDisplay = () => {
    if (isLive) {
      if (match.strStatus === "HT") return "HT";
      if (match.strStatus?.includes("'")) return match.strStatus;
      return "1H";
    }
    if (isFinished) return "FT";
    return match.strTime?.substring(0, 5) || "—";
  };

  const statusText = getStatusDisplay();

  return (
    <>
      <Link
        to={`/match/${match.idEvent}`}
        className="group flex items-stretch w-full hover:bg-white/3 transition-colors border-b border-white/6 last:border-0 min-h-[58px] relative"
      >
        <div
          className={`w-[3px] shrink-0 self-stretch rounded-r-sm my-2 transition-all ${
            isLive
              ? "bg-[#00ffa2] shadow-[0_0_10px_rgba(0,255,162,0.6)]"
              : isFinished
                ? "bg-[#FF4B4B] shadow-[0_0_8px_rgba(255,75,75,0.3)]"
                : "bg-white/10"
          }`}
        />

        <div className="flex flex-col items-center justify-center w-[54px] shrink-0 py-3">
          {isLive ? (
            <>
              <span className="text-[12px] font-bold text-[#00ffa2] leading-none tracking-tight">
                {statusText}
              </span>
              <div className="mt-1.5 w-4 h-[2px] bg-[#00ffa2] rounded-full shadow-[0_0_6px_#00ffa2] animate-live-wiggle" />
            </>
          ) : (
            <span
              className={`text-[12px] font-bold tracking-tight leading-none ${
                isFinished ? "text-[#FF4B4B]" : "text-white/40"
              }`}
            >
              {statusText}
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center gap-[9px] py-3 pl-1">
          <div className="flex items-center gap-2 min-w-0">
            {match.strHomeTeamBadge ? (
              <img
                src={match.strHomeTeamBadge}
                alt=""
                className="w-[18px] h-[18px] object-contain shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-[18px] h-[18px] rounded-full bg-white/10 shrink-0 flex items-center justify-center">
                <span className="text-[7px] text-white/40 font-bold">
                  {match.strHomeTeam?.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-[13px] font-medium text-white/90 truncate leading-none">
              {match.strHomeTeam}
            </span>
            {match.homeTag && <Tag label={match.homeTag} />}
            {match.homeCardColor && <CardIcon color={match.homeCardColor} />}
          </div>

          <div className="flex items-center gap-2 min-w-0">
            {match.strAwayTeamBadge ? (
              <img
                src={match.strAwayTeamBadge}
                alt=""
                className="w-[18px] h-[18px] object-contain shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-[18px] h-[18px] rounded-full bg-white/10 shrink-0 flex items-center justify-center">
                <span className="text-[7px] text-white/40 font-bold">
                  {match.strAwayTeam?.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-[13px] font-medium text-white/90 truncate leading-none">
              {match.strAwayTeam}
            </span>
            {match.awayTag && <Tag label={match.awayTag} />}
            {match.awayCardColor && <CardIcon color={match.awayCardColor} />}
          </div>
        </div>

        <div className="flex items-center pr-1 shrink-0">
          {hasScore && (
            <div className="flex flex-col items-end gap-[9px] py-3 mr-1">
              <div className="flex items-center gap-1.5 h-[18px]">
                {match.homeAggScore && (
                  <span className="text-[11px] text-white/25 font-semibold tabular-nums">
                    [{match.homeAggScore}]
                  </span>
                )}
                <span className="text-[14px] font-black text-white tabular-nums leading-none w-4 text-right">
                  {homeScore}
                </span>
              </div>
              <div className="flex items-center gap-1.5 h-[18px]">
                {match.awayAggScore && (
                  <span className="text-[11px] text-white/25 font-semibold tabular-nums">
                    [{match.awayAggScore}]
                  </span>
                )}
                <span className="text-[14px] font-black text-white tabular-nums leading-none w-4 text-right">
                  {awayScore}
                </span>
              </div>
            </div>
          )}

          <button
            ref={btnRef}
            onClick={handleMenuClick}
            className="w-8 h-full flex items-center justify-center text-white/20 hover:text-white/60 transition-colors shrink-0"
            aria-label="Match options"
          >
            <MoreVertical size={15} />
          </button>
        </div>
      </Link>

      {menuOpen && (
        <div
          className="fixed z-500 min-w-[196px] bg-[#1c2234] border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden py-1"
          style={{ top: menuPos.top, right: menuPos.right }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 pt-2 pb-3 border-b border-white/6">
            <span className="text-[11px] font-bold text-white/40 truncate max-w-[130px]">
              {match.strHomeTeam} vs {match.strAwayTeam}
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white/25 hover:text-white/70 transition-colors ml-2"
            >
              <X size={12} />
            </button>
          </div>

          {MENU_ACTIONS.map(({ icon: Icon, label, iconClass }) => (
            <button
              key={label}
              className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-white/5 transition-colors text-left group/item"
              onClick={() => setMenuOpen(false)}
            >
              <Icon
                size={14}
                className={`${iconClass} shrink-0 group-hover/item:scale-110 transition-transform`}
              />
              <span className="text-[13px] font-medium text-white/70 group-hover/item:text-white/90 transition-colors">
                {label}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default MatchCard;
