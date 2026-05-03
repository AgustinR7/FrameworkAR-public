const API_URL = import.meta.env.VITE_API_URL as string;

export const config = {
  apiUrl: API_URL,
  socketUrl: API_URL,
};
