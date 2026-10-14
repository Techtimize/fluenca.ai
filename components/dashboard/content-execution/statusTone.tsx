


export function statusTone(status?: string) {
  const value = String(status || "").toLowerCase();
  if (value.includes("publish") || value === "completed" || value === "scripted" || value === "imaged") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }
  if (value.includes("fail") || value.includes("error")) {
    return "bg-rose-50 text-rose-700 ring-rose-100";
  }
  if (value.includes("skip") || value.includes("disabled")) {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }
  if (value.includes("run") || value.includes("queue") || value.includes("pending")) {
    return "bg-[#ECEBFF] text-[#5B57E6] ring-[#D8D6F5]";
  }
  return "bg-[#F6F7FD] text-neutral-600 ring-[#E6E8F5]";
}
