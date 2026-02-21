import { useParams, Link } from "react-router-dom";
import { useMatchDetails } from "../hooks/useMatchDetails";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { MatchHero } from "../components/match/MatchHero";
import { MatchTimeline } from "../components/match/MatchTimeline";
import { PageLoader } from "../components/common/Loaders";

const MatchDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { matchDetails, events, loading, error } = useMatchDetails(id);
  const [activeTab, setActiveTab] = useState("Events");

  const TABS = ["Details", "Odds", "Lineups", "Events", "Stats", "Standings"];

  if (loading) return <PageLoader />;

  if (error || !matchDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8 bg-transparent">
        <p className="text-white/40 mb-6 text-[15px]">Match not found</p>
        <Link
          to="/matches"
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-[14px] hover:bg-primary/80 transition-colors"
        >
          Back to Matches
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[860px] mx-auto min-h-screen pb-10 text-white animate-[calFadeIn_0.3s_ease_forwards]">
      <div className="bg-[#1d1e2b] rounded-b-3xl overflow-hidden shadow-2xl">
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <Link
            to="/matches"
            className="text-white/50 hover:text-white transition-colors p-0.5 shrink-0"
          >
            <ChevronLeft size={20} />
          </Link>
          <span className="text-[13px] font-semibold text-white/55 truncate">
            {matchDetails.strLeague}
          </span>
        </div>

        <MatchHero matchDetails={matchDetails} />

        <div className="border-t border-white/8">
          <nav className="flex overflow-x-auto scrollbar-hide px-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-4 py-3 text-[13px] font-semibold whitespace-nowrap relative transition-colors ${
                  activeTab === tab
                    ? "text-accent"
                    : "text-white/35 hover:text-white/60"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-accent rounded-t-full shadow-[0_0_8px_rgba(0,255,162,0.4)]" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "Events" ? (
          <div className="mx-4 sm:mx-0 p-5 bg-[#1d1e2b] rounded-2xl shadow-xl">
            <h2 className="text-[14px] font-bold text-white/90 mb-6">
              Match Timeline
            </h2>
            <MatchTimeline
              events={events}
              homeScore={matchDetails.intHomeScore}
              awayScore={matchDetails.intAwayScore}
              startTime={matchDetails.strTime}
              isFinished={
                matchDetails.strStatus === "FT" ||
                matchDetails.strStatus === "Finished"
              }
            />
          </div>
        ) : (
          <div className="mx-4 sm:mx-0 bg-[#1d1e2b] rounded-2xl p-16 text-center shadow-inner border border-white/5">
            <p className="text-white/30 text-[14px] font-medium">
              {activeTab} Section Coming Soon
            </p>
            <p className="text-white/10 text-[12px] mt-2">
              We are currently synchronizing live data for this module.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDetailsPage;
