export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  sessionId: string;
}

export interface LoginData {
  username: string;
  password?: string;
}

export interface RegisterData {
  username?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}
