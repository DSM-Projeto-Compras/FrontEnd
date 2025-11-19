/**
 * @jest-environment jsdom
 */

import authService from "../../app/services/authService";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });


  describe("login", () => {
    it("should login successfully", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { token: "123", user: { email: "teste@teste.com" } },
      });

      const result = await authService.login({
        email: "teste@teste.com",
        senha: "123456",
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/logins"),
        { email: "teste@teste.com", senha: "123456" }
      );
      expect(result).toEqual({ token: "123", user: { email: "teste@teste.com" } });
    });

    it("should throw error on login failure", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Login Error"));

      await expect(
        authService.login({ email: "a", senha: "b" })
      ).rejects.toThrow("Login Error");
    });
  });


  describe("register", () => {
    it("should register successfully", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true },
      });

      const result = await authService.register({
        nome: "User",
        email: "user@mail.com",
        senha: "123",
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/logins/cadastro"),
        { nome: "User", email: "user@mail.com", senha: "123" }
      );
      expect(result).toEqual({ success: true });
    });

    it("should throw error on register failure", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Register Error"));

      await expect(
        authService.register({
          nome: "User",
          email: "user@mail.com",
          senha: "123",
        })
      ).rejects.toThrow("Register Error");
    });
  });


  describe("forgotPassword", () => {
    it("should return response data on success", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { ok: true },
      });

      const result = await authService.forgotPassword("teste@mail.com");

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/logins/forgot"),
        { email: "teste@mail.com" }
      );

      expect(result).toEqual({ ok: true });
    });

    it("should NOT throw error when axios rejects (branch coverage)", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Email error"));

      const result = await authService.forgotPassword("x@email.com");

      expect(result).toBeUndefined(); // porque o método não relança erro
    });
  });


  describe("verifyCode", () => {
    it("should verify code successfully", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { verified: true },
      });

      const result = await authService.verifyCode("a@mail.com", "1234");

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining("/logins/verify"),
        { email: "a@mail.com", codigo: "1234" }
      );

      expect(result).toEqual({ verified: true });
    });

    it("should throw error on verify failure", async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error("Verify Error"));

      await expect(
        authService.verifyCode("a@mail.com", "1234")
      ).rejects.toThrow("Verify Error");
    });
  });


  describe("resetPassword", () => {
    it("should reset password successfully", async () => {
      mockedAxios.patch.mockResolvedValueOnce({
        data: { changed: true },
      });

      const result = await authService.resetPassword(
        "mail@mail.com",
        "1111",
        "novaSenha"
      );

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining("/logins/reset"),
        { email: "mail@mail.com", codigo: "1111", novaSenha: "novaSenha" }
      );

      expect(result).toEqual({ changed: true });
    });

    it("should throw error on reset failure", async () => {
      mockedAxios.patch.mockRejectedValueOnce(new Error("Reset Error"));

      await expect(
        authService.resetPassword("m", "1", "x")
      ).rejects.toThrow("Reset Error");
    });
  });


  describe("getMe", () => {
    it("should throw when no token exists", async () => {
      localStorage.removeItem("access_token");

      await expect(authService.getMe()).rejects.toThrow("Token não encontrado");
    });

    it("should return user data when token exists", async () => {
      localStorage.setItem("access_token", "abc123");

      mockedAxios.get.mockResolvedValueOnce({
        data: { id: "1", nome: "UsuarioTeste" },
      });

      const result = await authService.getMe();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("/logins/me"),
        {
          headers: {
            "access-token": "abc123",
          },
        }
      );

      expect(result).toEqual({ id: "1", nome: "UsuarioTeste" });
    });

    it("should throw error on failure", async () => {
      localStorage.setItem("access_token", "abc123");

      mockedAxios.get.mockRejectedValueOnce(new Error("GetMe Error"));

      await expect(authService.getMe()).rejects.toThrow("GetMe Error");
    });
  });
});
