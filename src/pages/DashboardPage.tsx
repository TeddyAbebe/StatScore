import { useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useMatches } from "../hooks/useMatches";
import MatchCard from "../components/match/MatchCard";
import CalendarPicker from "../components/ui/CalendarPicker";
import { MatchCardSkeleton } from "../components/common/Loaders";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Wifi,
  Heart,
} from "lucide-react";
import { format, addDays, subDays, parseISO, isSameDay } from "date-fns";

const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = useMemo(() => new Date(), []);
  const dateParam = searchParams.get("date") || format(today, "yyyy-MM-dd");
  const leagueParam = searchParams.get("league") || "";
  const teamParam = searchParams.get("team") || "";

  const { matches, loading, loadingMore, error, hasMore, loadMore } =
    useMatches({
      date: teamParam ? undefined : dateParam,
      leagueId: leagueParam || undefined,
      teamId: teamParam,
    });

  const [activeTab, setActiveTab] = useState("All");
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Favorites logic
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

  // Infinite Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore, loadMore],
  );

  const handleDateSelect = (fullDate: string) => {
    setSearchParams((prev) => {
      prev.set("date", fullDate);
      return prev;
    });
  };

  const isLiveMatch = (m: any) =>
    ["Started", "1H", "2H", "HT"].includes(m.strStatus || "") ||
    m.strStatus?.includes("'");

  const counts = useMemo(() => {
    return {
      All: matches.length,
      Live: matches.filter(isLiveMatch).length,
      Favorites: matches.filter((m) => favorites.includes(m.idEvent)).length,
    };
  }, [matches, favorites]);

  const filteredMatches = useMemo(() => {
    let result = matches;
    if (activeTab === "Live") {
      result = matches.filter(isLiveMatch);
    } else if (activeTab === "Favorites") {
      result = matches.filter((m) => favorites.includes(m.idEvent));
    }
    return result;
  }, [matches, activeTab, favorites]);

  const displayLeagues = useMemo(() => {
    const leaguesMap: { [key: string]: typeof matches } = {};
    filteredMatches.forEach((m) => {
      const name = m.strLeague || "Other League";
      if (!leaguesMap[name]) leaguesMap[name] = [];
      leaguesMap[name].push(m);
    });
    return Object.entries(leaguesMap).map(([name, m]) => ({
      name,
      matches: m,
    }));
  }, [filteredMatches]);

  const TABS = [
    { id: "All", label: "All", icon: null },
    { id: "Live", label: "Live", icon: Wifi },
    { id: "Favorites", label: "Favorites", icon: Heart },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-[#181921] px-6 text-center">
        <p className="text-white/40 mb-4 text-[15px] font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white border border-white/10 px-6 py-2 rounded-xl font-bold text-[13px] hover:bg-primary/80 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-transparent min-h-screen">
      <div className="max-w-[860px] mx-auto px-4 md:px-6 pt-5 pb-16">
        <h1 className="text-[20px] md:text-[22px] font-bold text-white mb-4 tracking-tight">
          Matches
        </h1>

        <div className="hidden md:flex items-stretch bg-[#161a25] border border-white/[0.07] rounded-xl mb-5 overflow-hidden h-[52px]">
          <button
            onClick={() =>
              handleDateSelect(format(subDays(selectedDate, 1), "yyyy-MM-dd"))
            }
            className="w-14 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors shrink-0"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2.5 hover:bg-white/4 transition-colors"
            onClick={() => setCalendarOpen(true)}
          >
            <CalendarIcon size={16} className="text-white/50" />
            <span className="text-[15px] font-semibold text-white">
              {isSameDay(selectedDate, today)
                ? "Today"
                : format(selectedDate, "d MMM, yyyy")}
            </span>
          </button>
          <button
            onClick={() =>
              handleDateSelect(format(addDays(selectedDate, 1), "yyyy-MM-dd"))
            }
            className="w-14 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors shrink-0"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex items-center gap-3 mb-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const count = (counts as any)[tab.id];
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-[9px] rounded-xl text-[14px] font-bold transition-all border ${
                  isActive
                    ? "bg-[#00ffa2] text-[#0F111A] border-transparent shadow-[0_4px_20px_rgba(0,255,162,0.15)]"
                    : "bg-[#1d1e2b] text-white/40 border-white/[0.05] hover:text-white/70"
                }`}
              >
                {Icon && (
                  <Icon
                    size={isActive ? 17 : 17}
                    className={isActive ? "" : "text-white/20"}
                  />
                )}
                <span>{tab.label}</span>
                <span
                  className={`flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-[10px] sm:text-[11px] font-black ${
                    isActive
                      ? "bg-black/10 text-black/60"
                      : "bg-white/5 text-white/20"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          {loading && matches.length === 0 ? (
            <div className="flex flex-col gap-1">
              {[...Array(5)].map((_, i) => (
                <MatchCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {displayLeagues.map((league, idx) => (
                <div
                  key={idx}
                  className="bg-[#161a25]/70 rounded-xl overflow-hidden mb-4"
                >
                  <div className="px-4 py-3 border-b border-white/5">
                    <span className="text-[12px] font-black text-white/60 tracking-widest uppercase">
                      {league.name}
                    </span>
                  </div>
                  <div>
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

              {/* Infinite Scroll Trigger */}
              <div ref={lastElementRef} className="pb-10">
                {loadingMore && (
                  <div className="flex flex-col gap-1">
                    {[...Array(3)].map((_, i) => (
                      <MatchCardSkeleton key={i} />
                    ))}
                  </div>
                )}
                {!hasMore && matches.length > 0 && (
                  <div className="text-center py-10 opacity-20">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em]">
                      End of matches
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {!loading && filteredMatches.length === 0 && (
            <div className="py-20 text-center opacity-20">
              <CalendarIcon size={40} className="mx-auto mb-4" />
              <p className="font-bold uppercase tracking-widest text-[13px]">
                No matches found
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
