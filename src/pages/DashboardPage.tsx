import { useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useMatches } from "../hooks/useMatches";
import MatchCard from "../components/match/MatchCard";
import CalendarPicker from "../components/ui/CalendarPicker";
import DateScroller from "../components/ui/DateScroller";
import { MatchCardSkeleton } from "../components/common/Loaders";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Radio,
  LayoutGrid,
} from "lucide-react";
import { format, addDays, subDays, parseISO, isSameDay } from "date-fns";
import { checkIfLive, groupMatchesByLeague } from "../utils/matchUtils";
import { LeagueGroup, Match } from "../types";

const DashboardPage = () => {
  const [params, setSearchParams] = useSearchParams();

  const today = useMemo(() => new Date(), []);
  const dateParam = params.get("date") || format(today, "yyyy-MM-dd");
  const leagueParam = params.get("league") || "";
  const teamParam = params.get("team") || "";

  const { matches, loading, loadingMore, error, hasMore, loadMore } =
    useMatches({
      date: teamParam ? undefined : dateParam,
      leagueId: leagueParam || undefined,
      teamId: teamParam,
    });

  const [activeTab, setActiveTab] = useState("All");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const selectedDate = useMemo(() => parseISO(dateParam), [dateParam]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore || activeTab !== "All") return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, loadMore, activeTab],
  );

  const handleDateSelect = (fullDate: string) => {
    setSearchParams((prev) => {
      prev.set("date", fullDate);
      return prev;
    });
  };

  const counts = useMemo(() => {
    return {
      All: matches.length,
      Live: matches.filter((m) => checkIfLive(m.strStatus)).length,
      Favorites: matches.filter((m: Match) => favorites.includes(m.idEvent))
        .length,
    };
  }, [matches, favorites]);

  const filteredMatches = useMemo(() => {
    let result = matches;
    if (activeTab === "Live") {
      result = matches.filter((m) => checkIfLive(m.strStatus));
    } else if (activeTab === "Favorites") {
      result = matches.filter((m: Match) => favorites.includes(m.idEvent));
    }
    return result;
  }, [matches, activeTab, favorites]);

  const displayLeagues: LeagueGroup[] = useMemo(() => {
    return groupMatchesByLeague(filteredMatches);
  }, [filteredMatches]);

  const TABS = [
    { id: "All", label: "All", icon: LayoutGrid },
    { id: "Live", label: "Live", icon: Radio },
    { id: "Favorites", label: "Favorites", icon: Heart },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-[#0c0d12] px-6 text-center">
        <p className="text-white/40 mb-4 text-[15px] font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#00ffa2] text-black px-6 py-2 rounded-xl font-bold text-[13px] hover:bg-[#00ffa2]/80 transition-all font-outfit"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#10111a] min-h-screen font-outfit">
      <div className="max-w-[860px] mx-auto px-4 md:px-6 pt-6 pb-20">
        <div className="md:hidden">
          <DateScroller
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onCalendarClick={() => setCalendarOpen(true)}
          />
        </div>

        <div className="hidden md:flex items-stretch bg-[#1c2234]/40 border border-white/5 rounded-2xl mb-8 overflow-hidden h-[60px] shadow-lg">
          <button
            onClick={() =>
              handleDateSelect(format(subDays(selectedDate, 1), "yyyy-MM-dd"))
            }
            className="w-16 flex items-center justify-center text-white/30 hover:text-[#00ffa2] hover:bg-white/5 transition-all shrink-0"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-3 hover:bg-white/2 transition-all group"
            onClick={() => setCalendarOpen(true)}
          >
            <CalendarIcon
              size={18}
              className="text-[#00ffa2]/60 group-hover:text-[#00ffa2] transition-colors"
            />
            <span className="text-[16px] font-bold text-white tracking-tight">
              {isSameDay(selectedDate, today)
                ? "Today"
                : format(selectedDate, "d MMM, yyyy")}
            </span>
          </button>
          <button
            onClick={() =>
              handleDateSelect(format(addDays(selectedDate, 1), "yyyy-MM-dd"))
            }
            className="w-16 flex items-center justify-center text-white/30 hover:text-[#00ffa2] hover:bg-white/5 transition-all shrink-0"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mb-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const count = (counts as any)[tab.id];
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-[11px] rounded-xl text-[13px] sm:text-[15px] font-bold transition-all border ${
                  isActive
                    ? "bg-[#00ffa2] text-black border-transparent shadow-[0_8px_24px_rgba(0,255,162,0.2)]"
                    : "bg-[#1c2234]/40 text-white/50 border-white/5 hover:text-white/80 active:scale-95"
                }`}
              >
                {Icon && (
                  <Icon
                    size={16}
                    className={isActive ? "text-black" : "text-white/20"}
                    strokeWidth={isActive ? 3 : 2}
                  />
                )}
                <span>{tab.label}</span>
                <span
                  className={`flex items-center justify-center min-w-[20px] h-[20px] sm:min-w-[22px] sm:h-[22px] px-1.5 rounded-full text-[10px] sm:text-[11px] font-black ${
                    isActive
                      ? "bg-black/10 text-black/70"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-6">
          {loading && matches.length === 0 ? (
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, i) => (
                <MatchCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {displayLeagues.map((league, idx) => (
                <div
                  key={idx}
                  className="mx-1 sm:mx-0 bg-[#1c2234]/40 border border-white/5 rounded-[24px] overflow-hidden shadow-xl"
                >
                  <div className="px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between group cursor-pointer hover:bg-white/2 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] sm:text-[15px] font-bold text-white/90 tracking-tight">
                        {league.name}
                      </span>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-white/20 group-hover:text-white/50 transition-colors"
                    />
                  </div>

                  <div className="pb-2">
                    {league.matches.map((match) => (
                      <MatchCard
                        key={match.idEvent}
                        match={match}
                        isFavorite={favorites.includes(match.idEvent)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {activeTab === "All" && (
                <div ref={lastElementRef} className="pb-10 pt-4">
                  {loadingMore && (
                    <div className="flex flex-col gap-2">
                      {[...Array(3)].map((_, i) => (
                        <MatchCardSkeleton key={i} />
                      ))}
                    </div>
                  )}
                  {!hasMore && matches.length > 0 && (
                    <div className="text-center py-12 opacity-15">
                      <p className="text-[12px] font-black uppercase tracking-[0.3em] font-outfit">
                        All matches loaded
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {!loading && filteredMatches.length === 0 && (
            <div className="py-24 text-center opacity-15">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon size={32} className="text-white" />
              </div>
              <p className="font-black uppercase tracking-widest text-[14px]">
                No scheduled matches
              </p>
            </div>
          )}
        </div>
      </div>

      <CalendarPicker
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        selectedDate={dateParam}
        onSelect={handleDateSelect}
      />
    </div>
  );
};

export default DashboardPage;
