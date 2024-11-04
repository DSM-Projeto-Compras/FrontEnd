// src/services/searchBecService.ts
const BASE_URL = "https://www.bec.sp.gov.br/BEC_Catalogo_ui";

const SearchBecService = {
  getProducts: async (prefixText: string, count: number = 20) => {
    const url = `${BASE_URL}/WebService/AutoComplete.asmx/GetItensList`;
    const headers = {
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({ prefixText, count });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return { d: [] };
    }
  },

  searchProduct: async (description: string) => {
    const url = `${BASE_URL}/CatalogoPesquisa3.aspx?chave=&pesquisa=Y&cod_id=&ds_item=${encodeURIComponent(
      description
    )}`;

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar o produto.");
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error(error);
      return "";
    }
  },

  getProductDetails: async (cod_id: string) => {
    const url = `${BASE_URL}/CatalogDetalheNovo.aspx?chave=&cod_id=${encodeURIComponent(
      cod_id
    )}&selo=&origem=CatalogoPesquisa3`;

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erro ao obter detalhes do produto.");
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error(error);
      return "";
    }
  },
};

export default SearchBecService;
