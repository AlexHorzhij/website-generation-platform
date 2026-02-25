export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface RegisterData {
  name?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}
