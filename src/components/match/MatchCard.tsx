import { Link } from "react-router-dom";
import { MoreVertical, Heart, Bell, BarChart2, Share2, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  checkIfLive,
  checkIfFinished,
  getStatusDisplay,
} from "../../utils/matchUtils";
import { MatchCardProps } from "../../types";

const CardIcon = ({ color }: { color: "red" | "yellow" }) => (
  <span
    className={`inline-block w-[7px] h-[10px] rounded-[1px] shadow-sm ml-1.5 shrink-0 ${
      color === "red" ? "bg-[#ef4444]" : "bg-[#fcd34d]"
    }`}
  />
);

const Tag = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-[2px] ml-2 px-1.5 py-0.5 text-[9px] font-black leading-none rounded-full text-[#00ffa2] bg-[#00ffa2]/10 border border-[#00ffa2]/20 shrink-0 uppercase tracking-tighter">
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

  const isLive = checkIfLive(match.strStatus);
  const isFinished = checkIfFinished(match.strStatus);
  const statusText = getStatusDisplay(match);

  const homeScoreArr = match.intHomeScore;
  const awayScoreArr = match.intAwayScore;
  const hasScore =
    homeScoreArr !== null &&
    homeScoreArr !== undefined &&
    awayScoreArr !== null &&
    awayScoreArr !== undefined;

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
    <div className="relative border-b border-white/4 last:border-0 overflow-visible group">
      {isLive && (
        <div className="absolute inset-y-0 left-0 w-[120px] bg-linear-to-r from-[#00ffa2]/10 via-[#00ffa2]/2 to-transparent pointer-events-none" />
      )}

      <div className="flex items-stretch w-full hover:bg-white/2 transition-colors min-h-[82px] py-1 relative z-10">
        <div
          className={`w-[4px] shrink-0 self-stretch rounded-r-[2px] my-3 ml-2.5 transition-all ${
            isLive
              ? "bg-[#00ffa2] shadow-[0_0_12px_rgba(0,255,162,0.4)]"
              : isFinished
                ? "bg-[#ef4444]"
                : "bg-[#2c3349]"
          }`}
        />

        <div className="flex-1 flex items-center min-w-0">
          <div className="w-[60px] flex flex-col items-center justify-center shrink-0">
            <span
              className={`text-[13px] font-bold tracking-tight uppercase ${
                isLive
                  ? "text-[#00ffa2]"
                  : isFinished
                    ? "text-[#ef4444]"
                    : "text-white/40"
              }`}
            >
              {statusText}
            </span>
            {isLive && (
              <div className="mt-1 w-4 h-[1.5px] bg-[#00ffa2] rounded-full shadow-[0_0_8px_#00ffa2]" />
            )}
          </div>

          <Link
            to={`/match/${match.idEvent}`}
            className="flex-1 flex flex-col justify-center gap-[12px] min-w-0 pr-2"
          >
            <div className="flex items-center justify-between min-w-0 h-[22px]">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {match.strHomeTeamBadge && !homeBadgeError ? (
                  <img
                    src={match.strHomeTeamBadge}
                    alt=""
                    className="w-[20px] h-[20px] object-contain shrink-0"
                    onError={() => setHomeBadgeError(true)}
                  />
                ) : (
                  <div className="w-[20px] h-[20px] rounded-sm bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <span className="text-[8px] text-white/40 font-black uppercase">
                      {match.strHomeTeam?.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`text-[14px] font-bold truncate ${hasScore ? "text-white" : "text-white/70"}`}
                  >
                    {match.strHomeTeam}
                  </span>
                  {match.homeTag && <Tag label={match.homeTag} />}
                  {match.homeCardColor && (
                    <CardIcon color={match.homeCardColor} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {match.homeAggScore && (
                  <span className="text-[12px] text-white/20 font-medium tabular-nums">
                    [{match.homeAggScore}]
                  </span>
                )}
                <span
                  className={`text-[14px] font-black tabular-nums transition-colors w-4 text-center ${hasScore ? "text-white" : "text-white/10"}`}
                >
                  {match.intHomeScore ?? ""}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between min-w-0 h-[22px]">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {match.strAwayTeamBadge && !awayBadgeError ? (
                  <img
                    src={match.strAwayTeamBadge}
                    alt=""
                    className="w-[20px] h-[20px] object-contain shrink-0"
                    onError={() => setAwayBadgeError(true)}
                  />
                ) : (
                  <div className="w-[20px] h-[20px] rounded-sm bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <span className="text-[8px] text-white/40 font-black uppercase">
                      {match.strAwayTeam?.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`text-[14px] font-bold truncate ${hasScore ? "text-white" : "text-white/70"}`}
                  >
                    {match.strAwayTeam}
                  </span>
                  {match.awayTag && <Tag label={match.awayTag} />}
                  {match.awayCardColor && (
                    <CardIcon color={match.awayCardColor} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {match.awayAggScore && (
                  <span className="text-[12px] text-white/20 font-medium tabular-nums">
                    [{match.awayAggScore}]
                  </span>
                )}
                <span
                  className={`text-[14px] font-black tabular-nums transition-colors w-4 text-center ${hasScore ? "text-white" : "text-white/10"}`}
                >
                  {match.intAwayScore ?? ""}
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1 shrink-0 pr-1">
            <button
              onClick={handleToggleFavorite}
              className={`w-10 h-10 flex items-center justify-center transition-all rounded-full hover:bg-white/5 active:scale-75 ${
                favAnim
                  ? "scale-125 shadow-[0_0_20px_rgba(248,113,113,0.3)]"
                  : ""
              }`}
            >
              <Heart
                size={18}
                className={`transition-all duration-300 ${
                  isFavorite
                    ? "fill-[#f87171] text-[#f87171] drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]"
                    : "text-white/20 hover:text-white/40"
                }`}
                strokeWidth={isFavorite ? 0 : 2.5}
              />
            </button>
            <button
              ref={btnRef}
              onClick={handleMenuClick}
              className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/5 rounded-full transition-all shrink-0"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed z-500 min-w-[210px] bg-[#161a25] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden py-1.5 backdrop-blur-xl"
          style={{ top: menuPos.top, right: menuPos.right }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 pt-1 pb-3 border-b border-white/6 mb-1">
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
