export function shareUrl(path: string) {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}
export async function copyShareUrl(path: string) {
  await navigator.clipboard?.writeText(shareUrl(path));
}
