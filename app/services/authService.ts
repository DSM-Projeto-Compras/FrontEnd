import { env } from "@/config/env";
import axios from "axios";

// const apiUrl = "https://projeto-mvc-restful-server.vercel.app/api/logins";
const apiUrl = env.apiBaseUrl + "/logins";

interface LoginCredentials {
  email: string;
  senha: string;
}

interface RegisterCredentials {
  nome: string;
  email: string;
  senha: string;
}

class AuthService {
  async login(credentials: LoginCredentials) {
    try {
      const response = await axios.post(apiUrl, credentials);
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  }

  async register(credentials: RegisterCredentials) {
    try {
      const response = await axios.post(`${apiUrl}/cadastro`, credentials);
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  }
}

export default new AuthService();
