import axios from "axios";

// const apiUrl = "https://projeto-mvc-restful-server.vercel.app/api/products";
const apiProductUrl = process.env.NEXT_PUBLIC_API_BASEURL + "/products";
const apiUsersUrl = process.env.NEXT_PUBLIC_API_BASEURL + "/logins";

interface RequisitionData {
  nome: string;
  tipo: string;
  quantidade: number;
  categoria: string;
  descricao?: string;
  cod_id?: string;
  grupo?: string;
  classe?: string;
  material?: string;
  elemento?: string;
  natureza?: string;
}

interface EditData {
  _id: string;
  quantidade: number;
  descricao: string;
}

interface EditDataStatus {
  _id: string;
  status: string;
  justificativa: string;
}

interface RequisitedData {
  id: string;
  nome: string;
  data: string;
  tipo: string;
  quantidade: number;
  categoria: string;
  status: string;
  descricao?: string;
  justificativa?: string;
  cod_id?: string;
  grupo?: string;
  classe?: string;
  material?: string;
  elemento?: string;
  natureza?: string;
}

interface RequisitedDataAdmin {
  id: string;
  nome: string;
  data: string;
  tipo: string;
  quantidade: number;
  categoria: string;
  status: string;
  descricao?: string;
  user: {
    id: string;
    nome: string;
  };
  justificativa?: string;
  cod_id?: string;
  grupo?: string;
  classe?: string;
  material?: string;
  elemento?: string;
  natureza?: string;
}

interface RequisitedUserData {
  _id: string;
  nome: string;
  email: string;
  admin: boolean;
}

class RequisitionService {
  async sendRequisition(data: RequisitionData): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(apiProductUrl, data, {
        headers: {
          "access-token": token || "",
        },
      });
      console.log("Requisição enviada com sucesso");
    } catch (error) {
      console.error("Erro ao enviar a requisição:", error);
      throw error;
    }
  }

  async getProducts(): Promise<RequisitedData[]> {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(apiProductUrl, {
        headers: {
          "access-token": token || "",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  }

  // para admin
  async getAllProducts(): Promise<RequisitedDataAdmin[]> {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${apiProductUrl}/all`, {
        headers: {
          "access-token": token || "",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }
  }

  async updateProduct(data: EditData): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(`${apiProductUrl}/`, data, {
        headers: {
          "access-token": token || "",
        },
      });
      console.log("Produto atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar o produto:", error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${apiProductUrl}/${id}`, {
        headers: {
          "access-token": token || "",
        },
      });
      console.log("Produto excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir o produto:", error);
      throw error;
    }
  }

  async updateProductStatus(data: EditDataStatus): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(`${apiProductUrl}/aprove/${data._id}`, data, {
        headers: {
          "access-token": token || "",
        },
      });
      console.log("Requisição enviada com sucesso");
    } catch (error) {
      console.error("Erro ao enviar a requisição:", error);
      throw error;
    }
  }


  // Users
  async getAdmins(): Promise<RequisitedUserData[]> {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(apiUsersUrl, {
        headers: {
          "access-token": token || "",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar administradores:", error);
      throw error;
    }
  }
}

export default new RequisitionService();
