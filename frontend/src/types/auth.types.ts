export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface ApiError {
  message: string;
  error?: string;
}