import { Link } from "react-router-dom";
import { MoreVertical, Heart, Bell, BarChart2, Share2, X } from "lucide-react";
import { Match } from "../../types";
import { useState, useRef, useEffect } from "react";

interface MatchCardProps {
  match: Match;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
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

const MatchCard = ({
  match,
  isFavorite = false,
  onToggleFavorite,
}: MatchCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [favAnim, setFavAnim] = useState(false);
  const [homeBadgeError, setHomeBadgeError] = useState(false);
  const [awayBadgeError, setAwayBadgeError] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    const timer = setTimeout(
      () => document.addEventListener("click", close),
      0,
    );
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
        right: Math.min(
          window.innerWidth - rect.right,
          window.innerWidth - 200,
        ),
      });
    }
    setMenuOpen((v) => !v);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavAnim(true);
    setTimeout(() => setFavAnim(false), 400);
    onToggleFavorite?.(match.idEvent);
    setMenuOpen(false);
  };

  const isLive =
    ["Started", "1H", "2H", "HT"].includes(match.strStatus || "") ||
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

  const MENU_ACTIONS = [
    {
      icon: Heart,
      label: isFavorite ? "Remove from Favorites" : "Add to Favorites",
      iconClass: isFavorite
        ? "fill-[#f87171] text-[#f87171]"
        : "text-[#f87171]",
      action: handleToggleFavorite,
    },
    {
      icon: Bell,
      label: "Set Reminder",
      iconClass: "text-[#FBBD23]",
      action: () => setMenuOpen(false),
    },
    {
      icon: BarChart2,
      label: "View Statistics",
      iconClass: "text-[#3abff8]",
      action: () => setMenuOpen(false),
    },
    {
      icon: Share2,
      label: "Share Match",
      iconClass: "text-[#00ffa2]",
      action: () => setMenuOpen(false),
    },
  ];

  return (
    <div className="relative border-b border-white/[0.04] last:border-0 overflow-visible group">
      <div className="flex items-stretch w-full hover:bg-white/[0.02] transition-colors min-h-[58px]">
        {/* Active Indicator */}
        <div
          className={`w-[3px] shrink-0 self-stretch rounded-r-sm my-2 transition-all ${
            isLive
              ? "bg-[#00ffa2] shadow-[0_0_10px_rgba(0,255,162,0.6)]"
              : isFinished
                ? "bg-[#FF4B4B] shadow-[0_0_8px_rgba(255,75,75,0.3)]"
                : "bg-white/10"
          }`}
        />

        {/* Time/Status Section */}
        <Link
          to={`/match/${match.idEvent}`}
          className="flex flex-col items-center justify-center w-[54px] shrink-0 py-3"
        >
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
        </Link>

        {/* Teams Section */}
        <Link
          to={`/match/${match.idEvent}`}
          className="flex-1 flex flex-col justify-center gap-[9px] py-3 pl-1 min-w-0"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {match.strHomeTeamBadge && !homeBadgeError ? (
              <img
                src={match.strHomeTeamBadge}
                alt=""
                className="w-[18px] h-[18px] object-contain shrink-0"
                onError={() => setHomeBadgeError(true)}
              />
            ) : (
              <div className="w-[18px] h-[18px] rounded-full bg-white/5 shrink-0 flex items-center justify-center border border-white/10">
                <span className="text-[7px] text-white/40 font-black uppercase">
                  {match.strHomeTeam?.substring(0, 2)}
                </span>
              </div>
            )}
            <span className="text-[13px] font-semibold text-white/90 truncate leading-none">
              {match.strHomeTeam}
            </span>
            {match.homeTag && <Tag label={match.homeTag} />}
            {match.homeCardColor && <CardIcon color={match.homeCardColor} />}
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            {match.strAwayTeamBadge && !awayBadgeError ? (
              <img
                src={match.strAwayTeamBadge}
                alt=""
                className="w-[18px] h-[18px] object-contain shrink-0"
                onError={() => setAwayBadgeError(true)}
              />
            ) : (
              <div className="w-[18px] h-[18px] rounded-full bg-white/5 shrink-0 flex items-center justify-center border border-white/10">
                <span className="text-[7px] text-white/40 font-black uppercase">
                  {match.strAwayTeam?.substring(0, 2)}
                </span>
              </div>
            )}
            <span className="text-[13px] font-semibold text-white/90 truncate leading-none">
              {match.strAwayTeam}
            </span>
            {match.awayTag && <Tag label={match.awayTag} />}
            {match.awayCardColor && <CardIcon color={match.awayCardColor} />}
          </div>
        </Link>

        {/* Score & Actions Section */}
        <div className="flex items-center pr-1 shrink-0">
          {hasScore && (
            <Link
              to={`/match/${match.idEvent}`}
              className="flex flex-col items-end gap-[9px] py-3 px-3 hover:bg-white/5 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-1.5 h-[18px]">
                {match.homeAggScore && (
                  <span className="text-[11px] text-white/25 font-semibold tabular-nums">
                    [{match.homeAggScore}]
                  </span>
                )}
                <span className="text-[14px] font-black text-white tabular-nums leading-none min-w-[16px] text-right">
                  {homeScore}
                </span>
              </div>
              <div className="flex items-center gap-1.5 h-[18px]">
                {match.awayAggScore && (
                  <span className="text-[11px] text-white/25 font-semibold tabular-nums">
                    [{match.awayAggScore}]
                  </span>
                )}
                <span className="text-[14px] font-black text-white tabular-nums leading-none min-w-[16px] text-right">
                  {awayScore}
                </span>
              </div>
            </Link>
          )}

          <div className="flex items-center h-full ml-1">
            <button
              onClick={handleToggleFavorite}
              className={`w-10 h-full flex items-center justify-center shrink-0 transition-all ${
                favAnim ? "scale-125" : "scale-100"
              } hover:bg-white/5 rounded-lg`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart
                size={14}
                className={
                  isFavorite
                    ? "fill-[#f87171] text-[#f87171]"
                    : "text-white/15 hover:text-[#f87171] transition-colors"
                }
                strokeWidth={2.5}
              />
            </button>

            <button
              ref={btnRef}
              onClick={handleMenuClick}
              className="w-10 h-full flex items-center justify-center text-white/15 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all shrink-0"
              aria-label="Match options"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed z-[500] min-w-[210px] bg-[#161a25] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden py-1.5 backdrop-blur-xl"
          style={{ top: menuPos.top, right: menuPos.right }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 pt-1 pb-3 border-b border-white/[0.06] mb-1">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest truncate max-w-[140px]">
              Match Options
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white/20 hover:text-white/60 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {MENU_ACTIONS.map(({ icon: Icon, label, iconClass, action }) => (
            <button
              key={label}
              className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-white/5 transition-colors text-left group/item relative"
              onClick={action}
            >
              <Icon
                size={15}
                className={`${iconClass} shrink-0 group-hover/item:scale-110 transition-transform`}
                fill={label === "Remove from Favorites" ? "#f87171" : undefined}
                strokeWidth={2.5}
              />
              <span className="text-[13px] font-bold text-white/60 group-hover/item:text-white transition-colors">
                {label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchCard;
