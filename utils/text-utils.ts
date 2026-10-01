// Shortens text to the first `count` words, adding "..." when cut.
export function truncateWords(text: string, count: number): string {
  const words = text.trim().split(/\s+/);
  return words.length > count ? `${words.slice(0, count).join(" ")}...` : text;
}

// Turns markdown-ish text into plain text: drops "#" headings marks and "- " bullets.
export function stripMarkdown(text: string): string {
  return text
    .replace(/#+\s*/g, "")
    .replace(/(^|\s)-\s+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
