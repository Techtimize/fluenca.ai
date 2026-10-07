// components/landing/mockups/analytics-mockup.tsx
const R = 14;
const C = 2 * Math.PI * R;

export default function AnalyticsMockup() {
  return (
    <div className="relative h-full w-full">
      {/* Donut */}
      <div className="absolute left-0 top-0 h-[55%] w-[34%] rounded-xl bg-white p-3 shadow-md">
        <p className="text-[9px] text-slate-500">Performance</p>
        <div className="relative mx-auto mt-2 h-14 w-14">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle cx="18" cy="18" r={R} fill="none" stroke="#E0E7FF" strokeWidth="5" />
            <circle
              cx="18" cy="18" r={R} fill="none" stroke="#4F46E5" strokeWidth="5"
              strokeDasharray={`${0.8 * C} ${C}`} strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-slate-800">
            80%
          </span>
        </div>
      </div>

      {/* Line chart */}
      <div className="absolute right-0 top-[18%] h-[60%] w-[62%] rounded-xl bg-white/90 p-3 shadow-md">
        <svg viewBox="0 0 100 50" className="h-full w-full">
          <polyline points="0,40 20,30 40,34 60,18 80,24 100,6" fill="none" stroke="#6366F1" strokeWidth="1.5" />
          <polyline points="0,44 20,38 40,40 60,30 80,32 100,22" fill="none" stroke="#C7D2FE" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 rounded-md bg-white px-3 py-1.5 text-[10px] font-medium text-indigo-600 shadow-md">
        Set Your Goal
      </div>
    </div>
  );
}