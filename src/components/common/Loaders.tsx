import React from "react";

export const MatchCardSkeleton = () => (
  <div className="flex items-stretch w-full min-h-[58px] animate-pulse py-3">
    <div className="w-[3px] shrink-0 self-stretch rounded-r-sm my-2 bg-white/5" />
    <div className="flex flex-col items-center justify-center w-[54px] shrink-0 gap-1.5 px-2">
      <div className="w-8 h-3 bg-white/5 rounded" />
      <div className="w-4 h-[2px] bg-white/5 rounded-full" />
    </div>
    <div className="flex-1 flex flex-col justify-center gap-[9px] pl-1">
      <div className="flex items-center gap-2">
        <div className="w-[18px] h-[18px] rounded-full bg-white/5" />
        <div className="w-24 h-3 bg-white/5 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-[18px] h-[18px] rounded-full bg-white/5" />
        <div className="w-20 h-3 bg-white/5 rounded" />
      </div>
    </div>
    <div className="flex flex-col items-end justify-center w-12 pr-4 gap-3">
      <div className="w-4 h-3 bg-white/5 rounded" />
      <div className="w-4 h-3 bg-white/5 rounded" />
    </div>
  </div>
);

export const PageLoader = () => (
  <div className="flex items-center justify-center h-[60vh] w-full">
    <div className="w-10 h-10 border-[3px] border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);
