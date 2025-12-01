// Configurable API host
const getApiHost = (): string => {
  // Check if host is set in environment or localStorage
  const envHost = import.meta.env.VITE_API_HOST;
  const storedHost = localStorage.getItem('apiHost');
  
  return storedHost || envHost || 'http://localhost:8000/api/v1';
};

export const API_BASE_URL = getApiHost();

export const setApiHost = (host: string) => {
  localStorage.setItem('apiHost', host);
  window.location.reload(); // Reload to apply new host
};

export const getWsUrl = (path: string): string => {
  const base = API_BASE_URL.replace(/^http/, 'ws').replace(/\/api\/v1$/, '');
  return `${base}/api/v1${path}`;
};
