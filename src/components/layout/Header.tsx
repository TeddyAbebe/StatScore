import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  X,
  Trophy,
  BarChart2,
  Users,
  MapPin,
  Swords,
  Tv2,
  Goal,
} from "lucide-react";
import { RiMenuFill } from "react-icons/ri";
import globeIcon from "../../assets/globe.svg";
import soccerIcon from "../../assets/soccer.svg";
import Flag from "react-world-flags";
import logo from "../../assets/logo.png";

import { PREMIER_LEAGUE_ID } from "../../constants/api";

const tabs = [
  { label: "Live", path: "/live", icon: Tv2 },
  { label: "Matches", path: "/matches", icon: Goal },
  { label: "Standings", path: "/standings", icon: Trophy },
  { label: "Teams", path: "/teams", icon: Users },
  { label: "Comparison", path: "/comparison", icon: Swords },
  { label: "Statistics", path: "/statistics", icon: BarChart2 },
  { label: "Venues", path: "/venues", icon: MapPin },
];

const leagues = [
  { id: PREMIER_LEAGUE_ID, name: "Premier League", code: "GB-ENG" },
  { id: "4335", name: "La Liga", code: "ES" },
  { id: "4332", name: "Serie A", code: "IT" },
  { id: "4331", name: "Bundesliga", code: "DE" },
  { id: "4334", name: "Ligue 1", code: "FR" },
  { id: "4480", name: "Champions League", code: "EU" },
];

const Header = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentLeague = searchParams.get("league") || PREMIER_LEAGUE_ID;
  const selectedLeague =
    leagues.find((l) => l.id === currentLeague) || leagues[0];

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleLeagueChange = (id: string) => {
    setSearchParams((prev) => {
      prev.set("league", id);
      prev.delete("team");
      return prev;
    });
  };

  const isActive = (path: string) =>
    location.pathname === path ||
    (path === "/matches" &&
      (location.pathname === "/" || location.pathname.startsWith("/match/")));

  return (
    <>
      <header className="sticky top-0 z-100 w-full bg-primary mb-4">
        <div className="hidden lg:flex items-center h-[50px] px-6 max-w-[1440px] mx-auto gap-0">
          <Link to="/" className="flex items-center shrink-0 mr-5">
            <img
              src={logo}
              alt="statscore"
              className="h-[50px] w-auto object-contain"
            />
          </Link>

          <nav className="flex items-center h-full flex-1">
            {tabs.map((tab) => {
              const active = isActive(tab.path);
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`
                    h-full flex items-center px-3 xl:px-3.5 text-[13px] font-semibold
                    relative whitespace-nowrap transition-colors
                    ${active ? "text-accent" : "text-white/70 hover:text-white"}
                  `}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#6D00FF]/50 transition-colors">
              <img src={globeIcon} alt="globe" className="w-5 h-5" />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#6D00FF]/50 transition-colors">
              <img src={soccerIcon} alt="soccer" className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleLeagueChange(selectedLeague.id)}
              className="flex items-center gap-1.5 bg-[#6D00FF]/50 hover:bg-white/15 px-3 py-1.5 rounded-xl transition-colors"
            >
              <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
                <Flag
                  code={selectedLeague.code}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[13px] font-semibold text-white leading-none">
                {selectedLeague.name}
              </span>
              <ChevronDown size={13} className="text-white/60" />
            </button>

            <button className="flex items-center gap-1 bg-[#6D00FF]/50 hover:bg-white/15 px-3 py-[7px] rounded-xl transition-colors shrink-0">
              <span className="text-[13px] font-semibold text-white leading-none">
                2024/25
              </span>
              <ChevronDown size={13} className="text-white/60" />
            </button>

            <div className="w-[26px] h-[26px] rounded-full overflow-hidden border-2 border-white/30 shrink-0 cursor-pointer ml-0.5">
              <Flag code="GB" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="lg:hidden flex items-center justify-between h-[52px] px-4">
          <Link to="/" className="shrink-0">
            <img
              src={logo}
              alt="statscore"
              className="h-[35px] w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-1">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={soccerIcon} alt="soccer" className="w-5 h-5" />
            </div>

            <div className="w-8 h-8 flex items-center justify-center">
              <img src={globeIcon} alt="globe" className="w-5 h-5" />
            </div>

            <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
              <Flag code="GB-ENG" className="w-full h-full object-cover" />
            </div>

            <button className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md ml-1 shrink-0">
              <span className="text-[12px] font-bold text-white">2024/25</span>
              <ChevronDown size={11} className="text-white/60" />
            </button>

            <button
              onClick={() => setDrawerOpen(true)}
              className="w-9 h-9 flex items-center justify-center ml-0.5 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <RiMenuFill className="text-[22px] text-accent" />
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-150 bg-black/60 backdrop-blur-sm lg:hidden animate-[calFadeIn_0.2s_ease_forwards]"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 z-160 h-full w-[300px] bg-[#12102a] flex flex-col
          lg:hidden shadow-[-20px_0_60px_rgba(0,0,0,0.6)]
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 h-[52px] border-b border-white/8 shrink-0">
          <img
            src={logo}
            alt="statscore"
            className="h-[40px] w-auto object-contain"
          />
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-[2px] bg-linear-to-r from-transparent via-accent to-transparent opacity-60 shrink-0" />

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-[10px] font-black text-white/25 uppercase tracking-[0.15em] px-3 mb-2">
            Navigation
          </p>
          {tabs.map((tab) => {
            const active = isActive(tab.path);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                onClick={() => setDrawerOpen(false)}
                className={`
                  flex items-center gap-3.5 px-3 py-3 rounded-xl mb-1 text-[14px] font-semibold
                  transition-all relative
                  ${
                    active
                      ? "bg-primary/15 text-accent"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-accent rounded-full shadow-[0_0_10px_#00ffa2]" />
                )}
                <Icon
                  size={18}
                  className={active ? "text-accent" : "text-white/40"}
                />
                {tab.label}
                {active && (
                  <span className="ml-auto text-[10px] font-black bg-accent/15 text-accent px-2 py-0.5 rounded-full border border-accent/20">
                    Active
                  </span>
                )}
              </Link>
            );
          })}

          <div className="my-5 border-t border-white/6" />

          <p className="text-[10px] font-black text-white/25 uppercase tracking-[0.15em] px-3 mb-2">
            League
          </p>
          {leagues.map((league) => {
            const active = league.id === currentLeague;
            return (
              <button
                key={league.id}
                onClick={() => {
                  handleLeagueChange(league.id);
                  setDrawerOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1
                  text-[13px] font-semibold transition-all text-left
                  ${
                    active
                      ? "bg-primary/15 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                  <Flag
                    code={league.code}
                    className="w-full h-full object-cover"
                  />
                </div>
                {league.name}
                {active && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#00ffa2]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 px-5 py-4 border-t border-white/8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white/25">
                <Flag code="GB" className="w-full h-full object-cover" />
              </div>
              <span className="text-[13px] font-semibold text-white/70">
                English
              </span>
            </div>
            <div className="flex items-center gap-1 bg-white/8 px-2.5 py-1 rounded-md">
              <span className="text-[12px] font-bold text-white">2024/25</span>
              <ChevronDown size={12} className="text-white/50" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Header;
