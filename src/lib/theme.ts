/**
 * Color-mode vocabulary shared by the root layout's pre-paint script and the
 * ThemeToggle island. The mode lives on <html data-mode>; CSS remaps the
 * palette tokens from it (see "Dark mode" in globals.css).
 *
 * A stored choice wins; without one the page follows the system preference,
 * including live changes. Without JavaScript the page stays light.
 */
export type ColorMode = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/** Browser chrome tint per mode; matches --color-paper. */
export const THEME_COLORS: Record<ColorMode, string> = {
  light: "#ffffff",
  dark: "#0a0a0a",
};

/**
 * Runs in <head> before first paint so a dark visit never flashes light.
 * Storage can throw (privacy modes); the system preference still applies.
 */
export const themeScript = `(function(){var d=document.documentElement,m;try{m=localStorage.getItem('${THEME_STORAGE_KEY}')}catch(e){}if(m!=='light'&&m!=='dark')m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.setAttribute('data-mode',m)})()`;
