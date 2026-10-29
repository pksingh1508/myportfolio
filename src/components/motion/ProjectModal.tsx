"use client";

import { useRouter } from "next/navigation";
import { ViewTransition, useCallback, useEffect, useRef, type ReactNode } from "react";
import { projectShotName } from "../../lib/view-transitions";
import { CloseIcon } from "../ui/Icons";

type ProjectModalProps = {
  readonly slug: string;
  /** Document title while the modal is open; the intercepted route's metadata never applies. */
  readonly title: string;
  /** Id of the project title inside the sheet, which names the dialog. */
  readonly labelledBy: string;
  readonly children: ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

/** Longest wait for the Back navigation to commit before the close animates anyway. */
const COMMIT_TIMEOUT = 1000;

/** Names one element for a manual view transition; returns its undo. */
function nameForTransition(element: HTMLElement, name: string, className: string) {
  element.style.setProperty("view-transition-name", name);
  element.style.setProperty("view-transition-class", className);
  return () => {
    element.style.removeProperty("view-transition-name");
    element.style.removeProperty("view-transition-class");
  };
}

/**
 * Resolves once `element` leaves the document, or after the timeout. DOM
 * mutations, not animation frames: rendering (and with it rAF) is paused
 * while a view transition's update callback runs.
 */
function waitForRemoval(element: Element, timeout: number) {
  return new Promise<void>((resolve) => {
    if (!element.isConnected) {
      resolve();
      return;
    }
    const done = () => {
      observer.disconnect();
      window.clearTimeout(timer);
      resolve();
    };
    const observer = new MutationObserver(() => {
      if (!element.isConnected) done();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const timer = window.setTimeout(done, timeout);
  });
}

/**
 * Dialog shell for the intercepted `/work/[slug]` route: the project opens
 * over the homepage with its own URL, Back closes it, and a refresh or a
 * shared link loads the full case-study page instead.
 *
 * Opening is a React view transition (CSS: "Project modal" in globals.css):
 * the scrim fades, the panel rises, and the selected-work frame flies into
 * the panel (DeckShot → SharedShot). The scrim and panel are the top-level
 * boundaries on purpose: React only plays `enter`/`exit` on a ViewTransition
 * with no newly inserted DOM above it.
 *
 * Closing always goes back through history, so the close button, Escape,
 * the scrim, and the browser's Back button share one history entry. React
 * flushes Back (popstate) navigations eagerly without a view transition, so
 * the modal's own close runs one by hand: it names the scrim, panel, and
 * shot, navigates back inside the transition's update, waits for the
 * homepage card to take the shot back, and names that frame as the landing
 * spot. The browser's Back button closes instantly.
 *
 * While open, the page underneath is inert and its scroll is locked; focus
 * starts on the dialog, Tab cycles inside it, and closing returns focus to
 * the card that opened it. Without View Transitions the panel still rises
 * through a CSS entrance.
 */
export default function ProjectModal({ slug, title, labelledBy, children }: ProjectModalProps) {
  const router = useRouter();
  const scrimRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closing = useRef(false);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const scrim = scrimRef.current;
    const panel = panelRef.current;
    const shot = panel?.querySelector<HTMLElement>(".sheet-shot");
    if (
      typeof document.startViewTransition !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !scrim ||
      !panel
    ) {
      router.back();
      return;
    }
    const shotName = projectShotName(slug);
    const undo = [
      nameForTransition(scrim, "project-modal-scrim", "modal-scrim-out"),
      nameForTransition(panel, "project-modal-panel", "modal-panel-out"),
      ...(shot ? [nameForTransition(shot, shotName, "morph")] : []),
    ];
    const landing = () =>
      document.querySelector<HTMLElement>(
        `.deck-shot[data-slug="${CSS.escape(slug)}"]:not([data-lifted])`,
      );
    const transition = document.startViewTransition(async () => {
      router.back();
      await waitForRemoval(panel, COMMIT_TIMEOUT);
      undo.forEach((restore) => restore());
      const card = landing();
      if (card) undo.push(nameForTransition(card, shotName, "morph"));
    });
    void transition.finished.finally(() => {
      undo.forEach((restore) => restore());
    });
  }, [router, slug]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    // Captured once: a Strict Mode re-run would otherwise record the panel.
    if (!opener.current && document.activeElement instanceof HTMLElement) {
      opener.current = document.activeElement;
    }
    closing.current = false;

    const html = document.documentElement;
    html.setAttribute("data-modal-open", "");
    const background = Array.from(document.body.children).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement &&
        !element.matches("[data-project-modal]") &&
        !element.querySelector("[data-project-modal]") &&
        !element.inert,
    );
    background.forEach((element) => {
      element.inert = true;
    });
    panel.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.getClientRects().length > 0,
      );
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const previousTitle = document.title;
    document.title = title;

    return () => {
      document.title = previousTitle;
      document.removeEventListener("keydown", onKeyDown);
      background.forEach((element) => {
        element.inert = false;
      });
      html.removeAttribute("data-modal-open");
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    };
  }, [close, title]);

  return (
    <>
      <ViewTransition
        name="project-modal-scrim"
        enter="modal-scrim-in"
        exit="modal-scrim-out"
        default="none"
      >
        <div
          ref={scrimRef}
          className="project-modal-scrim"
          data-project-modal=""
          aria-hidden="true"
          onClick={close}
        />
      </ViewTransition>
      <ViewTransition
        name="project-modal-panel"
        enter="modal-panel-in"
        exit="modal-panel-out"
        default="none"
      >
        <div
          ref={panelRef}
          className="project-modal-panel"
          data-project-modal=""
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          tabIndex={-1}
        >
          <button
            type="button"
            className="project-modal-close"
            aria-label="Close project"
            onClick={close}
          >
            <CloseIcon />
          </button>
          <div className="project-modal-scroll">{children}</div>
        </div>
      </ViewTransition>
    </>
  );
}
