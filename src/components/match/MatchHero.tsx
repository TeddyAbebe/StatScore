import { format, parseISO } from "date-fns";
import { TeamBadge } from "./TeamBadge";
import { checkIfLive, checkIfFinished } from "../../utils/matchUtils";
import { MatchHeroProps } from "../../types";

export const MatchHero = ({ matchDetails }: MatchHeroProps) => {
  const isFinished = checkIfFinished(matchDetails.strStatus);
  const isLive = checkIfLive(matchDetails.strStatus);

  const statusLabel = isFinished
    ? "Finished"
    : isLive
      ? matchDetails.strStatus || "Live"
      : matchDetails.strStatus || "—";

  const matchDate = matchDetails.dateEvent
    ? (() => {
        try {
          return format(
            parseISO(matchDetails.dateEvent),
            "d MMM",
          ).toUpperCase();
        } catch {
          return "11 AUG";
        }
      })()
    : "11 AUG";

  return (
    <section className="px-5 pt-8 pb-10 bg-transparent font-outfit">
      <div className="flex items-center justify-between gap-2 max-w-[620px] mx-auto relative">
        <div className="flex flex-col items-center gap-4 flex-1 min-w-0">
          <div className="relative">
            <div className="p-1">
              <TeamBadge
                src={matchDetails.strHomeTeamBadge}
                name={matchDetails.strHomeTeam}
                size={68}
              />
            </div>
            <div className="absolute -top-1 -right-7 flex flex-row gap-[3px]">
              {(matchDetails.homeYellowCards ?? 0) > 0 && (
                <div className="w-[18px] h-[24px] bg-[#fcd34d] rounded-[2px] flex items-center justify-center text-[12px] font-black text-black/80 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/10">
                  {matchDetails.homeYellowCards}
                </div>
              )}
              {(matchDetails.homeRedCards ?? 0) > 0 && (
                <div className="w-[18px] h-[24px] bg-[#ef4444] rounded-[2px] flex items-center justify-center text-[12px] font-black text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/10">
                  {matchDetails.homeRedCards}
                </div>
              )}
            </div>
          </div>
          <span className="text-[16px] sm:text-[18px] font-bold text-white tracking-tight text-center truncate w-full">
            {matchDetails.strHomeTeam}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5 shrink-0 px-5">
          <span className="text-[12px] font-bold text-white/30 tracking-[0.2em] mb-1">
            {matchDate}
          </span>
          <div className="flex items-center gap-5">
            <span className="text-[48px] sm:text-[56px] font-black text-white leading-none tabular-nums tracking-[-0.05em]">
              {matchDetails.intHomeScore ?? "0"}
            </span>
            <span className="text-[34px] font-light text-white/10 leading-none">
              -
            </span>
            <span className="text-[48px] sm:text-[56px] font-black text-white leading-none tabular-nums tracking-[-0.05em]">
              {matchDetails.intAwayScore ?? "0"}
            </span>
          </div>
          <span
            className={`mt-2.5 px-3.5 py-[4px] text-[10px] font-black rounded-[5px] tracking-widest uppercase ${
              isFinished
                ? "bg-[#ef6356]/90 text-white"
                : isLive
                  ? "bg-[#00ffa2] text-[#181921] shadow-[0_0_20px_rgba(0,255,162,0.4)]"
                  : "bg-white/5 text-white/30"
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="flex flex-col items-center gap-4 flex-1 min-w-0">
          <div className="relative">
            <div className="p-1">
              <TeamBadge
                src={matchDetails.strAwayTeamBadge}
                name={matchDetails.strAwayTeam}
                size={68}
              />
            </div>
            <div className="absolute -top-1 -left-7 flex flex-row gap-[3px]">
              {(matchDetails.awayRedCards ?? 0) > 0 && (
                <div className="w-[18px] h-[24px] bg-[#ef4444] rounded-[2px] flex items-center justify-center text-[12px] font-black text-white shadow-[0_0_8px_rgba(0,0,0,0.5)] border border-white/10">
                  {matchDetails.awayRedCards}
                </div>
              )}
              {(matchDetails.awayYellowCards ?? 0) > 0 && (
                <div className="w-[18px] h-[24px] bg-[#fcd34d] rounded-[2px] flex items-center justify-center text-[12px] font-black text-black/80 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-white/10">
                  {matchDetails.awayYellowCards}
                </div>
              )}
            </div>
          </div>
          <span className="text-[16px] sm:text-[18px] font-bold text-white tracking-tight text-center truncate w-full">
            {matchDetails.strAwayTeam}
          </span>
        </div>
      </div>
    </section>
  );
};
