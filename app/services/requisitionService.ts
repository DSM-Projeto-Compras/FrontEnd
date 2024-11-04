import axios from "axios";

const apiUrl = "https://projeto-mvc-restful-server.vercel.app/api/products";

interface RequisitionData {
  nome: string;
  tipo: string;
  quantidade: number;
  categoria: string;
  descricao?: string;
}

interface RequisitedData {
  _id: string;
  nome: string;
  data: string;
  tipo: string;
  quantidade: number;
  categoria: string;
  status: string;
  descricao?: string;
}

class RequisitionService {
  async sendRequisition(data: RequisitionData): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(apiUrl, data, {
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
      const response = await axios.get(apiUrl, {
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
  async getAllProducts(): Promise<RequisitedData[]> {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${apiUrl}/all`, {
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

  async updateProduct(id: string, data: RequisitionData): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(`${apiUrl}/${id}`, data, {
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
      await axios.delete(`${apiUrl}/${id}`, {
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
}

export default new RequisitionService();
