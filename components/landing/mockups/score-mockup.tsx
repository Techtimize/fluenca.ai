// components/landing/mockups/score-mockup.tsx
const bars = [40, 70, 55, 90, 75];

export default function ScoreMockup() {
  return (
    <div className="relative h-full w-full">
      {/* Gauge */}
      <div className="absolute left-0 top-0 flex h-[60%] w-[58%] flex-col items-center justify-end rounded-xl bg-white p-3 shadow-md">
        <svg viewBox="0 0 100 55" className="w-full">
          {Array.from({ length: 15 }).map((_, i) => {
            const a = Math.PI + (i / 14) * Math.PI;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * 34} y1={50 + Math.sin(a) * 34}
                x2={50 + Math.cos(a) * 46} y2={50 + Math.sin(a) * 46}
                stroke={i < 12 ? "#F59E0B" : "#E5E7EB"}
                strokeWidth="4" strokeLinecap="round"
              />
            );
          })}
        </svg>
        <p className="-mt-6 text-lg font-bold text-slate-900">80.5%</p>
        <p className="text-[8px] text-slate-500">Overall Score</p>
      </div>

      {/* List */}
      <div className="absolute right-0 top-[8%] h-[40%] w-[34%] space-y-1.5 rounded-xl bg-white p-2 shadow-md">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 rounded bg-green-400/80" />
        ))}
      </div>

      {/* Area */}
      <div className="absolute bottom-0 left-0 h-[34%] w-[38%] rounded-xl bg-white/90 p-2 shadow-md">
        <svg viewBox="0 0 100 40" className="h-full w-full">
          <path d="M0 35 L25 20 L50 28 L75 10 L100 22 L100 40 L0 40Z" fill="#C7D2FE" />
        </svg>
      </div>

      {/* Bars */}
      <div className="absolute bottom-0 right-0 flex h-[44%] w-[50%] items-end justify-around rounded-xl bg-white p-3 shadow-md">
        {bars.map((h, i) => (
          <div key={i} className="w-2.5 rounded-t bg-indigo-500" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}