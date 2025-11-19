/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

jest.mock("../../../app/contexts/AuthContext", () => ({
    useAuth: jest.fn(),
}));

import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import '@testing-library/jest-dom'
import mockRouter from "next-router-mock";
import { http } from "msw";
import { env } from "../../../config/env"
import { setupServer } from "msw/node";
import Router from 'next/router'
import { useAuth } from "../../../app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AdminRegisterPage from "../../../app/pages/admin-register/page";

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
        render(<AdminRegisterPage />);
        const credentials = {
            nome: "Usuario teste",
            email: "admin.teste@fatec.sp.gov.br",
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

        console.log(mockRouter.asPath)
        screen.logTestingPlaygroundURL()
        // expect(mockRouter.asPath).toEqual("/");
    })
})