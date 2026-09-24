/// <reference types="vite/client" />

/**
 * Resolves static public asset URLs correctly across both local dev (/)
 * and GitHub Pages (/GPDS-Website-design/).
 */
export const assetUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.replace(/^\/+/, '');
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  return baseUrl.endsWith('/') ? `${baseUrl}${cleanPath}` : `${baseUrl}/${cleanPath}`;
};
