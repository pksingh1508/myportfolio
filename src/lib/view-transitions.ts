/**
 * View-transition vocabulary shared by server and client components.
 *
 * `PROJECT_OPEN` tags navigations from a selected-work card into its case
 * study. Only that type morphs the project's shot (see SharedShot); other
 * navigations, including browser back, keep the plain page cross-fade.
 */
export const PROJECT_OPEN = "project-open";

/** One shared name per project, used once on each page that shows its shot. */
export const projectShotName = (slug: string) => `project-shot-${slug}`;
