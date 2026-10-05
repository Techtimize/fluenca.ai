export const humanize = (key: string): string =>
    key.replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
export const isPrimitive = (value: unknown): boolean =>
    typeof value === "string" || typeof value === "number" || typeof value === "boolean";