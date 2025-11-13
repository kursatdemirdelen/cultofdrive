export function getImageUrl(path: string): string {
  return path.startsWith('public/') ? `/${path.replace('public/', '')}` : path;
}
