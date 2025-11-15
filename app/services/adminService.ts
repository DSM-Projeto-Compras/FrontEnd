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

  async deleteUser(id: string) {
    try {
      const token = localStorage.getItem("access_token");
      
      const response = await axios.delete(`${apiUrl}/usuario/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      throw error;
    }
  }

  async changePassword(senhaAtual: string, novaSenha: string, confirmaNovaSenha: string) {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.patch(
        `${apiUrl}/change`,
        { senhaAtual, novaSenha, confirmaNovaSenha },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao mudar senha:", error);
      throw error;
    }
  }
}

export default new AdminService();
