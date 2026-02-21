import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const BouncingBall = () => {
  const ballRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 50, y: 50 });
  const vel = useRef({ x: 0.4, y: 0.55 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      if (pos.current.x <= 0 || pos.current.x >= 97) vel.current.x *= -1;
      if (pos.current.y <= 0 || pos.current.y >= 94) vel.current.y *= -1;

      if (ballRef.current) {
        ballRef.current.style.left = `${pos.current.x}%`;
        ballRef.current.style.top = `${pos.current.y}%`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div
      ref={ballRef}
      className="absolute w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 pointer-events-none select-none"
      style={{ left: "50%", top: "50%" }}
    >
      <span
        className="text-2xl sm:text-3xl md:text-4xl leading-none"
        role="img"
        aria-label="football"
      >
        ⚽
      </span>
    </div>
  );
};

const Particle = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="absolute rounded-full bg-primary/30 blur-sm pointer-events-none"
    style={style}
  />
);

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown === 0) {
      navigate("/matches");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  const particles = [
    {
      width: 6,
      height: 6,
      top: "12%",
      left: "8%",
      animationDelay: "0s",
      animationDuration: "6s",
    },
    {
      width: 10,
      height: 10,
      top: "25%",
      left: "78%",
      animationDelay: "1s",
      animationDuration: "8s",
    },
    {
      width: 4,
      height: 4,
      top: "68%",
      left: "15%",
      animationDelay: "2s",
      animationDuration: "5s",
    },
    {
      width: 8,
      height: 8,
      top: "80%",
      left: "85%",
      animationDelay: "0.5s",
      animationDuration: "7s",
    },
    {
      width: 5,
      height: 5,
      top: "45%",
      left: "92%",
      animationDelay: "1.5s",
      animationDuration: "9s",
    },
    {
      width: 12,
      height: 12,
      top: "10%",
      left: "55%",
      animationDelay: "3s",
      animationDuration: "6s",
    },
    {
      width: 6,
      height: 6,
      top: "90%",
      left: "40%",
      animationDelay: "2.5s",
      animationDuration: "7.5s",
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-52px)] bg-[#0F111A] flex items-center justify-center overflow-hidden px-4 py-10 sm:py-14">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 sm:w-96 sm:h-96 bg-accent/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-primary/5 rounded-full blur-[140px]" />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] border-2 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white rounded-full" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-white" />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[15%] h-[50%] border-2 border-white border-l-0" />
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[15%] h-[50%] border-2 border-white border-r-0" />
      </div>

      {particles.map((p, i) => (
        <Particle
          key={i}
          style={{
            width: p.width,
            height: p.height,
            top: p.top,
            left: p.left,
            animation: `notFoundFloat ${p.animationDuration} ease-in-out ${p.animationDelay} infinite alternate`,
          }}
        />
      ))}

      <BouncingBall />

      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm sm:max-w-md md:max-w-lg animate-[notFoundFadeUp_0.6s_ease_forwards]">
        <div className="relative mb-2 select-none">
          <span
            className="text-[80px] sm:text-[100px] md:text-[120px] font-black leading-none tracking-tighter"
            style={{
              background:
                "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 40%, #00ffa2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 60px rgba(139,92,246,0.35))",
            }}
          >
            404
          </span>
          <span
            className="hidden md:flex absolute inset-0 text-[120px] sm:text-[160px] md:text-[200px] font-black leading-none tracking-tighter text-white/3 select-none"
            aria-hidden
          >
            404
          </span>
        </div>

        <div className="flex items-center gap-2 mb-5 sm:mb-6">
          <div className="w-4 h-6 sm:w-5 sm:h-7 bg-red-500 rounded-[3px] shadow-[0_0_16px_rgba(239,68,68,0.6)] rotate-[-8deg]" />
          <span className="text-[11px] sm:text-[13px] font-black text-red-400 uppercase tracking-[0.15em]">
            Red Card — Page Sent Off
          </span>
          <div className="w-4 h-6 sm:w-5 sm:h-7 bg-red-500 rounded-[3px] shadow-[0_0_16px_rgba(239,68,68,0.6)] rotate-[8deg]" />
        </div>

        <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight mb-3 leading-tight">
          You've wandered off
          <br className="hidden xs:block" /> the pitch!
        </h1>

        <p className="text-white/45 text-[10px] sm:text-[11px] font-medium leading-relaxed max-w-[300px] sm:max-w-[380px] mb-7 sm:mb-8">
          The page you're looking for has been substituted, transferred, or
          simply never existed. Let's get you back to the match.
        </p>

        <div className="flex items-center gap-3 bg-[#161a25] border border-white/8 rounded-2xl px-4 sm:px-5 py-3 mb-7 sm:mb-8 w-full max-w-[320px] sm:max-w-[340px]">
          <span className="text-xl sm:text-2xl shrink-0">📺</span>
          <div className="text-left min-w-0">
            <p className="text-[10px] sm:text-[11px] font-black text-accent uppercase tracking-widest mb-0.5">
              VAR Review
            </p>
            <p className="text-[12px] sm:text-[13px] text-white/60 font-medium leading-snug">
              Redirecting to home in{" "}
              <span className="text-white font-black tabular-nums">
                {countdown}s
              </span>
            </p>
          </div>
          <div className="ml-auto shrink-0">
            <svg
              width="34"
              height="34"
              viewBox="0 0 36 36"
              className="-rotate-90"
            >
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2.5"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 15}`}
                strokeDashoffset={`${2 * Math.PI * 15 * (1 - countdown / 10)}`}
                style={{ transition: "stroke-dashoffset 0.9s linear" }}
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-[320px] sm:max-w-[360px]">
          <button
            onClick={() => navigate("/matches")}
            className="w-full sm:flex-1 h-11 sm:h-12 bg-primary hover:bg-primary/90 text-white text-[13px] sm:text-[14px] font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2"
          >
            <span>🏟️</span>
            Back to Matches
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:flex-1 h-11 sm:h-12 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-[13px] sm:text-[14px] font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <span>↩</span>
            Go Back
          </button>
        </div>

        <div className="mt-8 sm:mt-10 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-white/20 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
          <span>Live</span>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span>Matches</span>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span>Standings</span>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span>Teams</span>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
