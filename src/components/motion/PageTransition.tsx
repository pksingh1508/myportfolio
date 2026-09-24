import { ViewTransition, type ReactNode } from "react";

/**
 * Route-level cross-fade. App Router navigations run as transitions, so
 * React animates this boundary when a page enters or exits (see "Route
 * transitions" in globals.css). default="none" keeps every other update
 * still, and browsers without the View Transition API navigate instantly.
 * Wrap each page, not the layout: layouts persist, so they never enter.
 */
export default function PageTransition({ children }: { readonly children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
