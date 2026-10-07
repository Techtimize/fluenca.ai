// components/landing/mockups/company-form-mockup.tsx
const fields = [
  { label: "Company name", placeholder: "Enter company name" },
  { label: "Industry", placeholder: "Enter industry" },
  { label: "Website link", placeholder: "Enter website link" },
];

export default function CompanyFormMockup() {
  return (
    <div className="w-full max-w-[75%] rounded-xl bg-white/10 p-4 ring-1 ring-white/30">
      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.label}>
            <p className="mb-1 text-[10px] text-white/90">{f.label}</p>
            <div className="rounded-md bg-white/15 px-2 py-1.5 text-[10px] text-white/60 ring-1 ring-white/30">
              {f.placeholder}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="mt-2 w-full rounded-md bg-indigo-600 py-1.5 text-[10px] font-medium text-white"
        >
          Start Training
        </button>
      </div>
    </div>
  );
}