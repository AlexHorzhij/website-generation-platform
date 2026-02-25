export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "USER" | string;
  createdAt: string;
  site: string;
}
