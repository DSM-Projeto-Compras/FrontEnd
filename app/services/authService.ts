import axios from "axios";

// const apiUrl = "https://projeto-mvc-restful-server.vercel.app/api/logins";
const apiUrl = process.env.NEXT_PUBLIC_API_BASEURL + "/logins";

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

  async forgotPassword(email: string) {
    try {
      const response = await axios.post(`${apiUrl}/forgot`, {email});

      return response.data;
    } catch (error) {
      console.log(error);
      //console.error("Erro ao enviar email de recuperação:", error);
      //throw error;
    }
  }

  async verifyCode(email: string, codigo: string) {
  try {
    const response = await axios.post(`${apiUrl}/verify`, { email, codigo });
    return response.data;
  } catch (error) {
    console.error("Erro ao verificar código:", error);
    throw error;
  }
  }

  async resetPassword(email: string, codigo: string, novaSenha: string) {
    try {
      const response = await axios.patch(`${apiUrl}/reset`, {
        email,
        codigo,
        novaSenha,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      throw error;
    }
  }

  async getMe() {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token não encontrado");

      const response = await axios.get(`${apiUrl}/me`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error);
      throw error;
    }
  }
}

export default new AuthService();
