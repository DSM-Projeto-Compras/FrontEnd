/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

jest.mock("../../../app/contexts/AuthContext", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../../../app/services/adminService", () => ({
    register: jest.fn(),
}));

import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import '@testing-library/jest-dom'
import { http } from "msw";
import { env } from "../../../config/env"
import { setupServer } from "msw/node";
import Router from 'next/router'
import { useAuth } from "../../../app/contexts/AuthContext";
import AdminRegisterPage from "../../../app/pages/admin-register/page";
import adminService from "../../../app/services/adminService";

interface RegisterAdminBody {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
}

const handleRegister = async ({ request } : {request: Request}) => {
    const body = await request.json() as RegisterAdminBody
    const {email} = body;

    if(email === "erro@teste.com") {
        return Response.json({
            errors: [
                { msg: "Apenas emails institucionais da Fatec (@fatec.sp.gov.br) são permitidos" },
            ]
        },{status: 400});
    }

    if(email === "errogenerico@fatec.sp.gov.br") {
        return new Response(
            null,
            { status: 500, statusText: 'Internal Server Error' }
        )
    }

    // Simula registro bem-sucedido
    return Response.json({
        message: "Usuário registrado com sucesso!",
    }, { status: 201 });
}

const server = setupServer(
    http.post<any, RegisterAdminBody, any>(`${env.apiBaseUrl}/logins/cadastro-admin`, handleRegister),

    http.post<any, RegisterAdminBody, any>(`/logins/cadastro-admin`, handleRegister)
)

describe("Register Admin Page Elements", () => {
    beforeAll(() => {
        server.listen();
    });

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ //autenticar usuário na tela
            isAuthenticated: true, 
            user: { email: "admin2@fatec.sp.gov.br", cargo: "admin"}, 
            login: jest.fn(), 
            logout: jest.fn() 
        })
        
    })

    afterAll(() => { 
        server.close()
    });
    afterEach(() => {
        server.resetHandlers();
        (Router.push as jest.Mock).mockClear();
        jest.clearAllMocks();
    })

    it("should render elements", async () => {
        await act( async() => {
            render(<AdminRegisterPage />)
        })

        const inputNome = screen.getByRole('textbox', {
            name: /nome/i
        })
        const titulo = screen.getByRole('heading', {  name: /crie uma nova conta de administrador/i})
        const botaoCriar = screen.getByRole('button', {  name: /criar conta/i})

        expect(inputNome).toBeInTheDocument()
        expect(titulo).toBeInTheDocument()
        expect(botaoCriar).toBeInTheDocument()
    })

    it("should register succesfully and navigate to /admin-users", async () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            loading: false,
        });

        const pushMock = jest.fn();
        jest.spyOn(require("next/navigation"), "useRouter").mockReturnValue({
            push: pushMock
        });

        Storage.prototype.getItem = jest.fn(() => "fake-token");
        
        render(<AdminRegisterPage />)

        const credentials = {
            nome: "Usuario teste",
            email: "admin.teste@fatec.sp.gov.br",
            senha: "Senha@teste123",
            confirmarSenha: "Senha@teste123"
        }

        const inputNome = screen.getByRole('textbox', {
            name: /nome/i
        })
        const inputEmail = screen.getByRole('textbox', {
            name: /email/i
        })
        const inputSenha = screen.getByTestId('password')
        const inputConfirmar = screen.getByLabelText(/confirmar senha/i)
        const botaoCriar = screen.getByRole('button', {
            name: /criar conta/i
        })

        fireEvent.change(inputNome, { target: { value: credentials.nome}})
        fireEvent.change(inputEmail, { target: { value: credentials.email}})
        fireEvent.change(inputSenha, { target: { value: credentials.senha}})
        fireEvent.change(inputConfirmar, { target: { value: credentials.confirmarSenha}})

        await act(async () => {
            fireEvent.click(botaoCriar);
        });

        const modalButton = await screen.findByText("Fazer Login");
        expect(modalButton).toBeVisible()
        expect(screen.getByText("Cadastro realizado com sucesso!")).toBeVisible()

        fireEvent.click(modalButton);

        expect(pushMock).toHaveBeenCalledWith("admin-users");
    })

    it("should throw a password error (passwords mismatch)", async () => {
        Storage.prototype.getItem = jest.fn(() => "fake-token");

        render(<AdminRegisterPage />);
        const credentials = {
            nome: "Usuario teste",
            email: "admin@fatec.sp.gov.br",
            senha: "Senha@teste123",
            senhaErrada: "Senha@errada321"
        }

        const inputNome = screen.getByRole('textbox', {
            name: /nome/i
        })
        const inputEmail = screen.getByRole('textbox', {
            name: /email/i
        })
        const inputSenha = screen.getByTestId('password')
        const inputConfirmar = screen.getByLabelText(/confirmar senha/i)
        const botaoCriar = screen.getByRole('button', {
            name: /criar conta/i
        })

        fireEvent.change(inputNome, { target: { value: credentials.nome}})
        fireEvent.change(inputEmail, { target: { value: credentials.email}})
        fireEvent.change(inputSenha, { target: { value: credentials.senha}})
        fireEvent.change(inputConfirmar, { target: { value: credentials.senhaErrada}})

        await act(async () => {
            fireEvent.click(botaoCriar);
        });

        const errorMessage = await screen.findByText("As senhas não correspondem")

        expect(errorMessage).toBeVisible();
    })

    it("should show token error when no token exists", async () => {
        Storage.prototype.getItem = jest.fn(() => null) // <== força token ausente

        render(<AdminRegisterPage />)

        fireEvent.change(screen.getByTestId("name"), { target: { value: "User" } })
        fireEvent.change(screen.getByTestId("email"), { target: { value: "admin@fatec.sp.gov.br" } })
        fireEvent.change(screen.getByTestId("password"), { target: { value: "Senha@123" } })
        fireEvent.change(screen.getByTestId("confirmPassword"), { target: { value: "Senha@123" } })

        fireEvent.click(screen.getByRole("button", { name: /criar conta/i }))

        const msg = await screen.findByText("Token inválido. Faça login novamente.")
        expect(msg).toBeVisible()
    })

    it("should show API validation errors from error.response.data.errors", async () => {
        Storage.prototype.getItem = jest.fn(() => "fake-token")

        const mockRegister = jest.spyOn(adminService, "register")
        mockRegister.mockRejectedValue({
            response: { data: 
                { errors: [
                    { msg: "Apenas emails institucionais da Fatec (@fatec.sp.gov.br) são permitidos" },
                ]} 
            }
        })

        render(<AdminRegisterPage />)

        const credentials = {
            nome: "Usuario",
            email: "erro@teste.com",
            senha: "Senha@teste123",
            confirmarSenha: "Senha@teste123"
        }

        const nameField = screen.getByTestId("name");
        const emailField = screen.getByTestId("email");
        const passwordField = screen.getByTestId("password");
        const confirmpwdField = screen.getByTestId("confirmPassword");

        fireEvent.change(nameField, {target: {value:credentials.nome} })
        fireEvent.change(emailField, {target: {value:credentials.email}})
        fireEvent.change(passwordField, {target: {value:credentials.senha}})
        fireEvent.change(confirmpwdField, {target: {value:credentials.confirmarSenha}})


        await act(() => fireEvent.click(screen.getByRole("button", { name: /criar conta/i })))

        const msg = screen.getByText( /apenas emails institucionais da fatec \(@fatec\.sp\.gov\.br\) são permitidos/i)
        // const msg2 = await screen.findByText("A senha é obrigatória")
        // const msg3 = await screen.findByText("O nome é obrigatório")
        expect(msg).toBeVisible()
        // expect(msg2).toBeVisible()
        // expect(msg3).toBeVisible()
    })

    it("should show generic error when API throws unexpected error", async () => {
        Storage.prototype.getItem = jest.fn(() => "fake-token")

        const mockRegister = jest.spyOn(adminService, "register")
        mockRegister.mockRejectedValue(new Error("Network error"))

        render(<AdminRegisterPage />)

        const credentials = {
            nome: "Usuario",
            email: "teste@fatec.sp.gov.br",
            senha: "Senha@teste123",
            confirmarSenha: "Senha@teste123"
        }

        const nameField = screen.getByTestId("name");
        const emailField = screen.getByTestId("email");
        const passwordField = screen.getByTestId("password");
        const confirmpwdField = screen.getByTestId("confirmPassword");

        fireEvent.change(nameField, {target: {value:credentials.nome} })
        fireEvent.change(emailField, {target: {value:credentials.email}})
        fireEvent.change(passwordField, {target: {value:credentials.senha}})
        fireEvent.change(confirmpwdField, {target: {value:credentials.confirmarSenha}})

        await act (() => fireEvent.click(screen.getByRole("button", { name: /criar conta/i })))

        

        const msg = await screen.findByText(
            "Ocorreu um erro durante o cadastro. Por favor, tente novamente mais tarde."
        )

        expect(msg).toBeVisible()
    })

    it("should show validators on inputs", async () => {
        Storage.prototype.getItem = jest.fn(() => "fake-token")

        render(<AdminRegisterPage />)

        await act (() => fireEvent.click(screen.getByRole("button", { name: /criar conta/i })))

        const nome = screen.getByText(/o nome é obrigatório/i)
        const email = screen.getByText(/o email é obrigatório/i)
        const senha = screen.getByText(/a senha é obrigatória/i)
        const confirmaSenha = screen.getByText(/a confirmação de senha é obrigatória/i)

        expect(nome).toBeInTheDocument()
        expect(email).toBeInTheDocument()
        expect(senha).toBeInTheDocument()
        expect(confirmaSenha).toBeInTheDocument()
    })


    it("should redirect to / when user is not authenticated", () => {
        const pushMock = jest.fn();

        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });

        jest.spyOn(require("next/navigation"), "useRouter")
            .mockReturnValue({ push: pushMock });

        render(<AdminRegisterPage />);

        expect(pushMock).toHaveBeenCalledWith("/");
    });

    it("should set error messages from API error array", async () => {
        Storage.prototype.getItem = jest.fn(() => "fake-token");

        jest.spyOn(adminService, "register").mockRejectedValue({
            response: {
            data: {
                errors: [
                { msg: "Erro 1" },
                { msg: "Erro 2" },
                ],
            },
            },
        });

        render(<AdminRegisterPage />);

        fireEvent.change(screen.getByTestId("name"), { target: { value: "User" } });
        fireEvent.change(screen.getByTestId("email"), { target: { value: "admin@fatec.sp.gov.br" } });
        fireEvent.change(screen.getByTestId("password"), { target: { value: "123@Senha"} });
        fireEvent.change(screen.getByTestId("confirmPassword"), { target: { value: "123@Senha"} });

        fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

        expect(await screen.findByText("Erro 1")).toBeVisible();
        expect(screen.getByText("Erro 2")).toBeVisible();
    });
})