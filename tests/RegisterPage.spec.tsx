import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../app/pages/register/page";
import mockRouter from "next-router-mock";
import { setupServer } from "msw/node";
import { http } from "msw";
import { env } from "@/app/config/env"; // Aqui, você pode configurar seu ambiente (como a URL base da API).

// Mock do AuthService
jest.mock("../app/services/authService", () => ({
  register: jest.fn(),
}));

// Configurando o servidor MSW
const server = setupServer(
  // Simula a resposta de sucesso para o cadastro
  http.post(`${env.apiBaseUrl}/auth/register`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: "Cadastro realizado com sucesso" })
    );
  }),
  // Simula a resposta de erro para o cadastro (E-mail já cadastrado)
  rest.post(`${env.apiBaseUrl}/auth/register`, (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        errors: [{ msg: "E-mail já cadastrado" }, { msg: "Senha fraca" }],
      })
    );
  })
);

describe("RegisterPage", () => {
  beforeAll(() => {
    mockRouter.setCurrentUrl("/register");
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  it("deve renderizar a tela de cadastro com todos os campos", () => {
    render(<RegisterPage />);

    // Verifica se os campos estão presentes
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar Senha/i)).toBeInTheDocument();
    expect(screen.getByText(/Criar conta/i)).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro quando as senhas não coincidem", () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: "João" },
    });
    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { value: "joao@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: "senha123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar Senha/i), {
      target: { value: "senha456" },
    });

    fireEvent.click(screen.getByText(/Criar conta/i));

    // Verifica se a mensagem de erro aparece
    expect(
      screen.getByText(/As senhas não coincidem. Por favor, verifique./i)
    ).toBeInTheDocument();
  });

  it("deve redirecionar para a página inicial após cadastro bem-sucedido", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: "Maria" },
    });
    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { value: "maria@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: "senha123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar Senha/i), {
      target: { value: "senha123" },
    });

    fireEvent.click(screen.getByText(/Criar conta/i));

    await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/"));
  });

  it("deve exibir erros de validação quando a resposta da API falhar", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: "Carlos" },
    });
    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { value: "carlos@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: "senha123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar Senha/i), {
      target: { value: "senha123" },
    });

    fireEvent.click(screen.getByText(/Criar conta/i));

    await waitFor(() => {
      // Verifica se as mensagens de erro são exibidas
      expect(screen.getByText(/E-mail já cadastrado/i)).toBeInTheDocument();
      expect(screen.getByText(/Senha fraca/i)).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem genérica de erro em caso de falha no cadastro", async () => {
    // Simula um erro genérico
    server.use(
      rest.post(`${env.apiBaseUrl}/auth/register`, (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ message: "Erro no servidor, tente novamente mais tarde." })
        );
      })
    );

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: "Carlos" },
    });
    fireEvent.change(screen.getByLabelText(/E-mail/i), {
      target: { value: "carlos@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: "senha123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirmar Senha/i), {
      target: { value: "senha123" },
    });

    fireEvent.click(screen.getByText(/Criar conta/i));

    await waitFor(() => {
      // Verifica se a mensagem de erro genérica aparece
      expect(
        screen.getByText(
          /Ocorreu um erro durante o cadastro. Por favor, tente novamente mais tarde./i
        )
      ).toBeInTheDocument();
    });
  });
});
