import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  parseISO,
} from "date-fns";

interface CalendarPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelect: (date: string) => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const CalendarPicker = ({
  isOpen,
  onClose,
  selectedDate,
  onSelect,
}: CalendarPickerProps) => {
  const today = new Date();
  const parsed = selectedDate ? parseISO(selectedDate) : today;

  const [viewMonth, setViewMonth] = useState<Date>(startOfMonth(parsed));

  useEffect(() => {
    if (selectedDate) {
      setViewMonth(startOfMonth(parseISO(selectedDate)));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSelect = useCallback(
    (date: Date) => {
      onSelect(format(date, "yyyy-MM-dd"));
      onClose();
    },
    [onSelect, onClose],
  );

  const buildGrid = () => {
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(viewMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const cells: Date[] = [];
    let cur = gridStart;
    while (cur <= gridEnd) {
      cells.push(cur);
      cur = addDays(cur, 1);
    }
    return cells;
  };

  const grid = buildGrid();
  const selected = selectedDate ? parseISO(selectedDate) : null;

  const panelRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-200 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Blurred dark backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[calFadeIn_0.2s_ease_forwards]" />

      {/* Calendar Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full sm:w-auto sm:min-w-[340px] bg-[#161a25] border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-[0_-20px_60px_rgba(0,0,0,0.7)] sm:shadow-2xl overflow-hidden animate-[calSlideUp_0.25s_cubic-bezier(0.32,0.72,0,1)_forwards] sm:animate-[calFadeScale_0.2s_ease_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/5">
          <button
            onClick={() => setViewMonth((m) => subMonths(m, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-[15px] font-bold text-white tracking-tight">
            {format(viewMonth, "MMMM yyyy")}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all ml-1"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 px-4 pt-4 pb-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="flex items-center justify-center h-8 text-[11px] font-bold text-white/30 uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 px-4 pb-5 gap-y-1">
          {grid.map((date, idx) => {
            const isCurrentMonth = isSameMonth(date, viewMonth);
            const isToday = isSameDay(date, today);
            const isSelected = selected ? isSameDay(date, selected) : false;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(date)}
                className={`
                  relative flex items-center justify-center
                  h-9 w-full rounded-lg text-[13px] font-semibold
                  transition-all active:scale-95
                  ${
                    isSelected
                      ? "bg-primary text-white shadow-[0_0_16px_rgba(139,92,246,0.5)]"
                      : isToday
                        ? "text-accent font-bold hover:bg-white/5"
                        : isCurrentMonth
                          ? "text-white/80 hover:bg-white/5"
                          : "text-white/20 hover:bg-white/3"
                  }
                `}
              >
                {format(date, "d")}

                {isToday && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 pb-5">
          <button
            onClick={() => handleSelect(today)}
            className="w-full h-10 rounded-xl border border-white/8 text-[13px] font-bold text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
          >
            Jump to Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarPicker;
