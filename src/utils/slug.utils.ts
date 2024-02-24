/**
 * NOTE:
 *
 * These are really just "placeholder" functions.
 *
 * In a real pSEO project, you'd probably want to put more effort
 * into serializing and deserializing the slugs of each page.  Ideally,
 * you'd have a `slug` field on each entity in your database.
 *
 * Since this dataset doesn't have that, we're just using a quick and dirty
 * solution to get the job done.
 */

export function serializeSlug(str: string) {
  return encodeURIComponent(str);
}

export function deserializeSlug(str: string) {
  return decodeURIComponent(str);
}
