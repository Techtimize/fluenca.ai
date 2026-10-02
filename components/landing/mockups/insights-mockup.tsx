// components/landing/mockups/insights-mockup.tsx
const bubbles = [
  { width: "w-[60%]", align: "", bar: "w-1/3" },
  { width: "w-[55%]", align: "ml-auto", bar: "w-1/2" },
  { width: "w-[65%]", align: "", bar: "w-1/3" },
];

export default function InsightsMockup() {
  return (
    <div className="flex w-full flex-col gap-4">
      {bubbles.map((b, i) => (
        <div key={i} className={`h-9 rounded-lg bg-white shadow-md ${b.width} ${b.align}`}>
          <div className={`m-3 h-1.5 rounded bg-indigo-400 ${b.bar}`} />
        </div>
      ))}
    </div>
  );
}