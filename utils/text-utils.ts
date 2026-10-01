// Shortens text to the first `count` words, adding "..." when cut.
export function truncateWords(text: string, count: number): string {
  const words = text.trim().split(/\s+/);
  return words.length > count ? `${words.slice(0, count).join(" ")}...` : text;
}
