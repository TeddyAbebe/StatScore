import { Home, Calendar, Layout, Tv, Settings, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Layout, label: "Dashboard", path: "/matches" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
    { icon: Tv, label: "Live", path: "/live" },
  ];

  const bottomItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: LogOut, label: "Logout", path: "/logout" },
  ];

  return (
    <aside className="w-[88px] bg-[#161A25] flex flex-col items-center py-10 border-r border-white/5 h-screen sticky top-0">
      <div className="mb-14">
        <NavLink
          to="/"
          className="w-12 h-12 bg-primary rounded-[14px] flex items-center justify-center shadow-lg shadow-primary/30 transition-transform active:scale-95 group"
        >
          <span className="font-black text-2xl text-white italic group-hover:scale-110 transition-transform">
            S
          </span>
        </NavLink>
      </div>

      <nav className="flex-1 flex flex-col gap-10 w-full items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "relative flex items-center justify-center w-full py-2 group transition-all",
                isActive ? "text-accent" : "text-white/30 hover:text-white/60",
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={26}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all"
                />
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3.5px] h-7 bg-accent rounded-l-full shadow-[0_0_12px_rgba(0,255,165,0.6)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-10 w-full items-center pb-4">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className="text-white/20 hover:text-white transition-colors"
          >
            <item.icon size={26} />
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
