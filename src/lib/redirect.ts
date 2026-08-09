/**
 * Only same-site, path-relative redirects are honoured after auth, so a crafted
 * `?redirect=` can't bounce someone to another origin. Anything else falls back
 * to the home page.
 */
export const safeRedirect = (value: string | null | undefined) =>
  value && /^\/(?!\/)/.test(value) ? value : "/";
