import axios from "axios";

const apiUrl = `${process.env.NEXT_PUBLIC_API_BASEURL}/products`;

interface RequisitionData {
  nome: string;
  tipo: string;
  quantidade: number;
  categoria: string;
  descricao?: string;
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
  _id: string;
  nome: string;
  data: string;
  tipo: string;
  quantidade: number;
  categoria: string;
  status: string;
  descricao?: string;
  justificativa?: string;
}

interface RequisitedDataAdmin {
  _id: string;
  nome: string;
  data: string;
  tipo: string;
  quantidade: number;
  categoria: string;
  status: string;
  descricao?: string;
  userId: {
    _id: string;
    nome: string;
  };
  justificativa?: string;
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
  async getAllProducts(): Promise<RequisitedDataAdmin[]> {
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

  async updateProduct(data: EditData): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(`${apiUrl}/`, data, {
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

  async updateProductStatus(data: EditDataStatus): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(`${apiUrl}/aprove/${data._id}`, data, {
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
}

export default new RequisitionService();
