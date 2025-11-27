import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASEURL + "/chat";

class ChatService {
  private baseUrl: string;

  constructor() {
    // garante que não teremos "//" duplo 
    this.baseUrl = BASE.replace(/\/+$/, "");
  }

  async sendMessage(message: string) {
    try {
      const apiUrl = `${this.baseUrl}/`;
      const res = await axios.post(apiUrl, { message });
      return res.data;
    } catch (err) {
      console.error("ChatService.sendMessage error:", err);
      throw err;
    }
  }

  async greet() {
    try {
      const apiUrl = `${this.baseUrl}/greet`;
      const res = await axios.get(apiUrl);
      return res.data;
    } catch (err) {
      console.error("ChatService.greet error:", err);
      throw err;
    }
  }
}

export default new ChatService();
