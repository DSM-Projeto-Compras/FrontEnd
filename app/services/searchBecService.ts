// src/services/searchBecService.ts
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASEURL || '';

const SearchBecService = {
  getProducts: async (prefixText: string, count: number = 20) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const resp = await axios.post(
        `${API_BASE}/bec/products`,
        { prefixText, count },
        { headers: token ? { 'access-token': token } : undefined }
      );
      // backend returns { success, count, data }
      return { d: resp.data?.data || [] };
    } catch (error) {
      console.error('Erro getProducts (proxy):', error);
      return { d: [] };
    }
  },

  searchAndGetDetails: async (description: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const resp = await axios.post(
        `${API_BASE}/bec/search-details`,
        { description },
        { headers: token ? { 'access-token': token } : undefined }
      );
      return resp.data?.details || null;
    } catch (error) {
      console.error('Erro searchAndGetDetails (proxy):', error);
      return null;
    }
  },

  getProductDetails: async (cod_id: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const resp = await axios.get(`${API_BASE}/bec/product/${encodeURIComponent(cod_id)}`, {
        headers: token ? { 'access-token': token } : undefined,
      });
      return resp.data?.data || null;
    } catch (error) {
      console.error('Erro getProductDetails (proxy):', error);
      return null;
    }
  },
};

export default SearchBecService;
