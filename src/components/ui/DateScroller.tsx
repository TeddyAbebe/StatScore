import { useRef, useEffect } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { DateScrollerProps } from "../../types";

const DateScroller = ({
  selectedDate,
  onDateSelect,
  onCalendarClick,
}: DateScrollerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  const dates = Array.from({ length: 15 }, (_, i) =>
    addDays(subDays(today, 7), i),
  );

  useEffect(() => {
    const activeElement = scrollRef.current?.querySelector(".date-active");
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedDate]);

  return (
    <div className="flex items-center w-full gap-2 mb-6">
      <div
        ref={scrollRef}
        className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide py-1"
      >
        {dates.map((date) => {
          const isActive = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const dayName = format(date, "EEE").toUpperCase();
          const dayNum = format(date, "d");
          const monthName = format(date, "MMM").toUpperCase();

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(format(date, "yyyy-MM-dd"))}
              className={`flex flex-col items-center justify-center min-w-[72px] h-[64px] rounded-xl transition-all shrink-0 ${
                isActive
                  ? "bg-[#1c2234] border border-white/8 date-active"
                  : "bg-transparent active:bg-white/5"
              }`}
            >
              <span
                className={`text-[10px] font-black tracking-widest leading-none mb-1.5 ${
                  isActive ? "text-[#00ffa2]" : "text-white/20"
                }`}
              >
                {isToday ? "Today" : dayName}
              </span>
              <span
                className={`text-[12px] font-bold tracking-tight leading-none ${
                  isActive ? "text-white" : "text-white/40"
                }`}
              >
                {dayNum} {monthName}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onCalendarClick}
        className="w-[54px] h-[54px] bg-[#1c2234] border border-white/8 rounded-full flex items-center justify-center shrink-0 hover:bg-[#252b3d] transition-colors shadow-lg group ml-1"
      >
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-transparent group-hover:bg-white/5 transition-all">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
              stroke="#00ffa2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 2V6"
              stroke="#00ffa2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 2V6"
              stroke="#00ffa2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 10H21"
              stroke="#00ffa2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 14H7.01"
              stroke="#00ffa2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 14H11.01"
              stroke="#00ffa2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 14H15.01"
              stroke="#00ffa2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 18H7.01"
              stroke="#00ffa2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11 18H11.01"
              stroke="#00ffa2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 18H15.01"
              stroke="#00ffa2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default DateScroller;
