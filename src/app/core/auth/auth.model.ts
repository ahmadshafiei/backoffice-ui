export interface AuthUser {
  id: string;
  fullName: string;
  /** Display name of the user's role, e.g. «مدیر سیستم». */
  role: string;
}

export interface LoginRequest { username: string; password: string }
