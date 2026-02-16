import { postJson } from "./api";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    gender?: string;
  };
};

export type RegisterResponse = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
};

export function signIn(payload: LoginPayload): Promise<LoginResponse> {
  return postJson<LoginResponse>("/api/v1/sign-in", payload);
}

export function signUp(payload: RegisterPayload): Promise<RegisterResponse> {
  return postJson<RegisterResponse>("/api/v1/sign-up", payload);
}
