export interface userPayload {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  role?: number;
  password?: string;
  confirmPassword?: string;
}

export interface UserFetch {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  role: number;
}
