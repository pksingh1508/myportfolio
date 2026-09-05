"use client";

import { useReducedMotionPreference } from "../../lib/use-reduced-motion";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function CopyEmail({ email }: { readonly email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const [mounted, setMounted] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);
  const reduced = useReducedMotionPreference();
  useEffect(() => { alive.current = true; setMounted(true); return () => { alive.current = false; if (timeout.current) clearTimeout(timeout.current); }; }, []);
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); if (alive.current) setState("copied"); }
    catch { if (alive.current) setState("failed"); }
    if (!alive.current) return;
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setState("idle"), 2600);
  };
  if (!mounted) return null;
  const label = state === "copied" ? "Email copied" : state === "failed" ? "Use the email link" : "Copy email";
  return <button className="btn btn-secondary copy-email" type="button" onClick={copy} aria-label={label}>
    <span className="copy-label" aria-hidden="true"><AnimatePresence initial={false} mode="sync">
      <motion.span key={state} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -8 }} transition={{ duration: reduced ? 0 : .18 }}>{label}</motion.span>
    </AnimatePresence></span><span aria-hidden="true">{state === "copied" ? "✓" : "⧉"}</span>
    <span className="visually-hidden" role="status">{state === "idle" ? "" : label}</span>
  </button>;
}
