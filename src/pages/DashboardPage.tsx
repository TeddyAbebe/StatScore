import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useMatches } from "../hooks/useMatches";
import MatchCard from "../components/MatchCard";
import CalendarPicker from "../components/CalendarPicker";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Heart,
  Wifi,
} from "lucide-react";
import { PREMIER_LEAGUE_ID } from "../constants/api";
import { format, addDays, subDays, parseISO, isSameDay } from "date-fns";

const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = useMemo(() => new Date(), []);
  const dateParam = searchParams.get("date") || format(today, "yyyy-MM-dd");
  const leagueParam = searchParams.get("league") || "";
  const teamParam = searchParams.get("team") || "";

  const { matches, loading } = useMatches({
    date: teamParam ? undefined : dateParam,
    leagueId: leagueParam || PREMIER_LEAGUE_ID,
    teamId: teamParam,
  });

  const [activeTab, setActiveTab] = useState("All");
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [favorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const selectedDate = useMemo(() => parseISO(dateParam), [dateParam]);

  const dates = useMemo(() => {
    const list = [];
    for (let i = -5; i <= 5; i++) {
      const d = addDays(today, i);
      list.push({
        day: format(d, "EEE").toUpperCase(),
        date: format(d, "d MMM"),
        dayNum: format(d, "d"),
        month: format(d, "MMM"),
        fullDate: format(d, "yyyy-MM-dd"),
        isActive: isSameDay(d, selectedDate),
        isToday: isSameDay(d, today),
      });
    }
    return list;
  }, [selectedDate, today]);

  const handleDateSelect = (fullDate: string) => {
    setSearchParams((prev) => {
      prev.set("date", fullDate);
      return prev;
    });
  };

  const filteredMatches = useMemo(() => {
    let result = matches;
    if (activeTab === "Live") {
      result = matches.filter(
        (m) =>
          ["Started", "1H", "2H", "HT"].includes(m.strStatus || "") ||
          m.strStatus?.includes("'"),
      );
    } else if (activeTab === "Favorites") {
      result = matches.filter((m) => favorites.includes(m.idEvent));
    }
    return result;
  }, [matches, activeTab, favorites]);

  const liveCount = matches.filter(
    (m) =>
      ["Started", "1H", "2H", "HT"].includes(m.strStatus || "") ||
      m.strStatus?.includes("'"),
  ).length;

  const displayLeagues = useMemo(() => {
    const leagues: { [key: string]: typeof matches } = {};
    filteredMatches.forEach((m) => {
      const name = m.strLeague || "Other League";
      if (!leagues[name]) leagues[name] = [];
      leagues[name].push(m);
    });
    return Object.entries(leagues).map(([name, m]) => ({ name, matches: m }));
  }, [filteredMatches]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-[#181921]">
        <div className="w-9 h-9 border-[3px] border-[#00ffa2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#181921] min-h-screen">
      <div className="max-w-[860px] mx-auto px-4 md:px-6 pt-5 pb-16">
        <h1 className="text-[20px] md:text-[22px] font-bold text-white mb-4 tracking-tight">
          Matches
        </h1>

        {/* ══════════════ MOBILE Date Scroller ══════════════ */}
        <div className="md:hidden mb-4">
          <div className="flex items-stretch gap-0">
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex items-stretch gap-px min-w-max">
                {dates.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => handleDateSelect(d.fullDate)}
                    className={`flex flex-col items-center justify-center min-w-[56px] h-[60px] px-1 transition-all shrink-0 ${
                      d.isActive
                        ? "bg-[#1c1533] relative"
                        : "bg-transparent hover:bg-white/4"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-medium uppercase tracking-wide ${
                        d.isActive ? "text-white/60" : "text-white/30"
                      }`}
                    >
                      {d.isToday ? "Today" : d.day}
                    </span>
                    <span
                      className={`text-[13px] font-bold mt-0.5 ${
                        d.isActive ? "text-white" : "text-white/50"
                      }`}
                    >
                      {d.dayNum}
                    </span>
                    <span
                      className={`text-[10px] ${
                        d.isActive ? "text-white/60" : "text-white/30"
                      }`}
                    >
                      {d.month}
                    </span>
                    {d.isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00ffa2]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCalendarOpen(true)}
              className="w-[50px] h-[60px] flex items-center justify-center shrink-0 hover:bg-white/5 transition-colors"
            >
              <CalendarIcon size={18} className="text-[#00ffa2]" />
            </button>
          </div>
          <div className="h-px bg-white/6" />
        </div>

        {/* ══════════════ DESKTOP Date Navigation ══════════════ */}
        <div className="hidden md:flex items-stretch bg-[#161a25] border border-white/[0.07] rounded-xl mb-5 overflow-hidden h-[52px]">
          <button
            onClick={() =>
              handleDateSelect(format(subDays(selectedDate, 1), "yyyy-MM-dd"))
            }
            className="w-14 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors shrink-0"
            aria-label="Previous day"
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
            aria-label="Next day"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* ══════════════ Filter Tabs ══════════════ */}
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => setActiveTab("All")}
            className={`flex items-center gap-1.5 px-3 py-[6px] rounded-full text-[13px] font-semibold transition-all shrink-0 ${
              activeTab === "All"
                ? "bg-[#00ffa2] text-[#0F111A]"
                : "bg-transparent text-white/50 hover:text-white border border-white/10"
            }`}
          >
            <span>All</span>
            <span
              className={`text-[11px] font-black px-1.5 py-px rounded-full min-w-[18px] text-center ${
                activeTab === "All"
                  ? "bg-[#0F111A]/20 text-[#0F111A]"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {matches.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("Live")}
            className={`flex items-center gap-1.5 px-3 py-[6px] rounded-full text-[13px] font-semibold transition-all shrink-0 ${
              activeTab === "Live"
                ? "bg-white/10 text-white"
                : "bg-transparent text-white/50 hover:text-white border border-white/10"
            }`}
          >
            <Wifi
              size={12}
              className={activeTab === "Live" ? "text-white" : "text-white/40"}
            />
            <span>Live</span>
            <span
              className={`text-[11px] font-black px-1.5 py-px rounded-full min-w-[18px] text-center ${
                activeTab === "Live"
                  ? "bg-white/15 text-white"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {liveCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("Favorites")}
            className={`flex items-center gap-1.5 px-3 py-[6px] rounded-full text-[13px] font-semibold transition-all shrink-0 ${
              activeTab === "Favorites"
                ? "bg-white/10 text-white"
                : "bg-transparent text-white/50 hover:text-white border border-white/10"
            }`}
          >
            <Heart
              size={12}
              className={
                activeTab === "Favorites"
                  ? "fill-[#f87171] text-[#f87171]"
                  : "text-white/40"
              }
              strokeWidth={2}
            />
            <span>Favorites</span>
            <span
              className={`text-[11px] font-black px-1.5 py-px rounded-full min-w-[18px] text-center ${
                activeTab === "Favorites"
                  ? "bg-white/15 text-white"
                  : "bg-white/10 text-white/50"
              }`}
            >
              {favorites.length}
            </span>
          </button>
        </div>

        {/* ══════════════ League Sections ══════════════ */}
        <div className="flex flex-col gap-4">
          {displayLeagues.length > 0 ? (
            displayLeagues.map((league, idx) => (
              <div
                key={idx}
                className="bg-[#161a25]/70 rounded-xl overflow-hidden border border-white/6"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
                  <span className="text-[13px] font-semibold text-white/80">
                    {league.name}
                  </span>
                  <ChevronRight size={14} className="text-white/25" />
                </div>

                <div>
                  {league.matches.map((match) => (
                    <MatchCard key={match.idEvent} match={match} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <CalendarIcon size={36} className="mx-auto mb-3 text-white/15" />
              <p className="text-[14px] font-semibold text-white/25">
                No matches scheduled
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
