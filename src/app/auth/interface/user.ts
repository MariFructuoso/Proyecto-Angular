export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  name: string;
  avatar: string; 
}

export interface AuthResponse {
  accessToken: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string; 
  me?: boolean;    
}