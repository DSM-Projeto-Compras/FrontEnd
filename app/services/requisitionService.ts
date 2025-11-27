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
  id: string;
  quantidade: number;
  descricao: string;
}

interface EditDataStatus {
  id: string;
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
      console.log("dados: ", data)
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
      console.log("dados recebidos:", data)
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
      await axios.put(`${apiProductUrl}/aprove/${data.id}`, data, {
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

  async markAsRealized(productId: string, supplierId: string): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `${apiProductUrl}/${productId}/mark-realized`,
        { supplierId },
        {
          headers: {
            "access-token": token || "",
          },
        }
      );
      console.log("Produto marcado como Realizado com sucesso");
    } catch (error) {
      console.error("Erro ao marcar produto como Realizado:", error);
      throw error;
    }
  }

  async markAsDelivered(productId: string): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `${apiProductUrl}/${productId}/mark-delivered`,
        {},
        {
          headers: {
            "access-token": token || "",
          },
        }
      );
      console.log("Produto marcado como Entregue com sucesso");
    } catch (error) {
      console.error("Erro ao marcar produto como Entregue:", error);
      throw error;
    }
  }

  async markAsFinalized(productId: string): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `${apiProductUrl}/${productId}/mark-finalized`,
        {},
        {
          headers: {
            "access-token": token || "",
          },
        }
      );
      console.log("Produto marcado como Finalizado com sucesso");
    } catch (error) {
      console.error("Erro ao marcar produto como Finalizado:", error);
      throw error;
    }
  }

  async revertProductStatus(productId: string): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `${apiProductUrl}/${productId}/revert-status`,
        {},
        {
          headers: {
            "access-token": token || "",
          },
        }
      );
      console.log("Status do produto revertido com sucesso");
    } catch (error) {
      console.error("Erro ao reverter status do produto:", error);
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
