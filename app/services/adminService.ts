import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_BASEURL + "/logins";

interface LoginCredentials {
  email: string;
  senha: string;
}

interface RegisterCredentials {
  nome: string;
  email: string;
  senha: string;
  role: string;
}

class AdminService {
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
      const token = localStorage.getItem("access_token");
      const response = await axios.post(`${apiUrl}/cadastro-admin`, credentials, {
        headers: {
            Authorization: `Bearer ${token}`
        },
      });
      console.log("Token usado:", token);
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  }
}

export default new AdminService();
