import api from "./api";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordData,
  VerifyResetCodeData,
  ResetPasswordData,
  ChangePasswordData,
  UpdateUserData,
  User,
} from "@/types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/signin", credentials);
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/signup", credentials);
    return data;
  },

  forgotPassword: async (emailData: ForgotPasswordData): Promise<{ statusMsg: string; message: string }> => {
    const { data } = await api.post("/auth/forgotPasswords", emailData);
    return data;
  },

  verifyResetCode: async (codeData: VerifyResetCodeData): Promise<{ status: string }> => {
    const { data } = await api.post("/auth/verifyResetCode", codeData);
    return data;
  },

  resetPassword: async (resetData: ResetPasswordData): Promise<{ token: string }> => {
    const { data } = await api.put("/auth/resetPassword", resetData);
    return data;
  },

  changePassword: async (passwordData: ChangePasswordData): Promise<{ message: string; token: string }> => {
    const { data } = await api.put("/users/changeMyPassword", passwordData);
    return data;
  },

  updateUser: async (userData: UpdateUserData): Promise<{ user: User }> => {
    const { data } = await api.put("/users/updateMe/", userData);
    return data;
  },

  verifyToken: async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      
      // The API doesn't have a verify endpoint, so we'll verify by fetching user data
      // For now, we'll just decode the token payload
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { _id: payload.id, name: payload.name, email: "", role: payload.role };
    } catch {
      return null;
    }
  },
};
