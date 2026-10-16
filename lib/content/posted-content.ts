"use client";

import { useSyncExternalStore } from "react";

/**
 * Content items that were published, kept in this browser so the same post isn't published twice.
 * The publish endpoint doesn't link a post to its content item, so the backend can't tell us yet.
 */
export type PostedContent = {
  platform: string;
  postedAt: string;
  mediaId?: string | null;
  username?: string | null;
};

type PostedMap = Record<string, PostedContent>;

const STORAGE_KEY = "fluenca:posted-content";
const EMPTY: PostedMap = {};
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedMap: PostedMap = EMPTY;

function readRaw() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Parsed map, re-parsed only when the stored string changes so snapshots stay stable. */
function getSnapshot(): PostedMap {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedMap;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    cachedMap = parsed && typeof parsed === "object" ? (parsed as PostedMap) : EMPTY;
  } catch {
    cachedMap = EMPTY;
  }
  return cachedMap;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab posting the same content updates this one too.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function markContentPosted(contentId: string, info: PostedContent) {
  const next = { ...getSnapshot(), [contentId]: info };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked (private mode): fall back to this page view only.
    cachedRaw = null;
    cachedMap = next;
  }
  listeners.forEach((listener) => listener());
}

export function usePostedContent(): PostedMap {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

/** The publish endpoints answer with status "posted" once the post is live. */
export function isPostedResponse(response: unknown) {
  const status = (response as { status?: unknown } | null)?.status;
  return typeof status === "string" && status.toLowerCase() === "posted";
}
