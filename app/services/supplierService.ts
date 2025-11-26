import axios from "axios";

const apiSupplierUrl = process.env.NEXT_PUBLIC_API_BASEURL + "/suppliers";

interface SupplierData {
  nome: string;
  cnpj: string;
  cep?: string;
  rua?: string;
  cidade?: string;
  estado?: string;
  numero?: string;
  email?: string;
  telefone?: string;
}

interface Supplier {
  id: string;
  nome: string;
  cnpj: string;
  cep?: string;
  rua?: string;
  cidade?: string;
  estado?: string;
  numero?: string;
  email?: string;
  telefone?: string;
  dataCriacao: string;
}

class SupplierService {
  async createSupplier(data: SupplierData): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      
      // Remove campos vazios ou apenas com espaços
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value && value.trim() !== "")
      );
      
      await axios.post(apiSupplierUrl, cleanData, {
        headers: {
          "access-token": token || "",
        },
      });
      console.log("Fornecedor criado com sucesso");
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error);
      throw error;
    }
  }

  async getSuppliers(): Promise<Supplier[]> {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(apiSupplierUrl, {
        headers: {
          "access-token": token || "",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      throw error;
    }
  }

  async getSupplierById(id: string): Promise<Supplier> {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`${apiSupplierUrl}/${id}`, {
        headers: {
          "access-token": token || "",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar fornecedor:", error);
      throw error;
    }
  }

  async updateSupplier(id: string, data: SupplierData): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      
      // Remove campos vazios ou apenas com espaços
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value && value.trim() !== "")
      );
      
      await axios.put(`${apiSupplierUrl}/${id}`, cleanData, {
        headers: {
          "access-token": token || "",
        },
      });
      console.log("Fornecedor atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      throw error;
    }
  }

  async deleteSupplier(id: string): Promise<void> {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`${apiSupplierUrl}/${id}`, {
        headers: {
          "access-token": token || "",
        },
      });
      console.log("Fornecedor excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      throw error;
    }
  }

  async getAddressByCep(cep: string): Promise<any> {
    try {
      const cleanCep = cep.replace(/\D/g, "");
      const response = await axios.get(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );
      
      if (response.data.erro) {
        throw new Error("CEP não encontrado");
      }
      
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar endereço pelo CEP:", error);
      throw error;
    }
  }
}

export default new SupplierService();
