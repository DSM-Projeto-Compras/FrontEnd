/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock("next/navigation", () => ({
  useRouter: jest.fn()
}));

jest.mock("../../../app/contexts/AuthContext", () => ({
    useAuth: jest.fn(),
}));

// jest.mock("../../../app/services/adminService", () => ({
//     changePassword: jest.fn().mockResolvedValue({})            //não se mocka com msw
// }))


import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import '@testing-library/jest-dom'
import mockRouter from "next-router-mock";
import { http } from "msw";
import { env } from "../../../config/env"
import { setupServer } from "msw/node";
import Router from 'next/router'
import AdminPasswordPage from "../../../app/pages/admin-password/page";
import { useAuth } from "../../../app/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface AdminPasswordBody {
    senhaAtual: string, 
    novaSenha: string, 
    confirmaNovaSenha: string
}

//Handler de Submit
const HandleChangeRequest = async ({ request }: {request: Request}) => {
    const body = await request.json() as AdminPasswordBody;
    const { senhaAtual, novaSenha, confirmaNovaSenha } = body;

    if(senhaAtual === "senhaErrada"){
        return Response.json({
            message: "Senha atual incorreta."
        }, {status: 403});
    }

    if(novaSenha != confirmaNovaSenha){
        return Response.json({
            message: "Erro ao mudar senha:"
        }, {status: 403});
    }

    return Response.json({
        message: "Senha alterada com sucesso!"
    }, {status: 200})
}

const server = setupServer(
    http.patch<any, AdminPasswordBody, any>(`${env.apiBaseUrl}/logins/change`, HandleChangeRequest)
)

describe("Admin Change Password Elements", () => {
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
        // (Router.push as jest.Mock).mockClear();
        jest.clearAllMocks();
    })

    it("should render elements", async () => {
        await act( async() => {
            render(<AdminPasswordPage />)
        })

        const titulo = screen.getByRole('heading', {  name: /alterar senha/i})
        const novaSenha = screen.getByText(/confirmar nova senha/i)
        const botao = screen.getByRole('button', {
            name: /alterar senha/i
        })

        expect(titulo).toBeInTheDocument()
        expect(novaSenha).toBeInTheDocument()
        expect(botao).toBeInTheDocument()
    })

    it("should change password succesfully and display message", async () => {
        await act(async() =>{
            render(<AdminPasswordPage />)
        })

        const credentials = {
            senhaAtual: "Admin@1234",
            novaSenha: "Senha@nova321",
            confirmarSenha: "Senha@nova321"
        }

        const inputAtual = screen.getByTestId('senhaAtual')
        const inputNova = screen.getByTestId('novaSenha')
        const inputConfirmar = screen.getByTestId('confirmarSenha')

        const botaoAlterar = screen.getByRole('button', {  name: /alterar senha/i})

        fireEvent.change(inputAtual, { target: { value: credentials.senhaAtual }})
        
        fireEvent.change(inputNova, { target: { value: credentials.novaSenha }})

        fireEvent.change(inputConfirmar, { target: { value: credentials.confirmarSenha }})

        await act(async() => fireEvent.click(botaoAlterar) ) 

        expect(screen.getByText(/senha alterada com sucesso!/i)).toBeInTheDocument()
    })

    it("should throw an error for mismatch passwords", async() => {
        await act(async() =>{
            render(<AdminPasswordPage />)
        })

        const credentials = {
            senhaAtual: "senhaErrada",
            novaSenha: "Senha@nova321",
            confirmarSenha: "Senha@novadiferente123"
        }

        const inputAtual = screen.getByTestId('senhaAtual')
        const inputNova = screen.getByTestId('novaSenha')
        const inputConfirmar = screen.getByTestId('confirmarSenha')

        const botaoAlterar = screen.getByRole('button', {  name: /alterar senha/i})

        fireEvent.change(inputAtual, { target: { value: credentials.senhaAtual }})
        
        fireEvent.change(inputNova, { target: { value: credentials.novaSenha }})

        fireEvent.change(inputConfirmar, { target: { value: credentials.confirmarSenha }})

        await act(async() => fireEvent.click(botaoAlterar) ) 

        expect(screen.getByText(/as senhas não coincidem\./i)).toBeInTheDocument()
    })

    it("should throw an error for wrong actual password", async() => {
        await act(async() =>{
            render(<AdminPasswordPage />)
        })

        const credentials = {
            senhaAtual: "senhaErrada",
            novaSenha: "Senha@nova321",
            confirmarSenha: "Senha@nova321"
        }

        const inputAtual = screen.getByTestId('senhaAtual')
        const inputNova = screen.getByTestId('novaSenha')
        const inputConfirmar = screen.getByTestId('confirmarSenha')

        const botaoAlterar = screen.getByRole('button', {  name: /alterar senha/i})

        fireEvent.change(inputAtual, { target: { value: credentials.senhaAtual }})
        
        fireEvent.change(inputNova, { target: { value: credentials.novaSenha }})

        fireEvent.change(inputConfirmar, { target: { value: credentials.confirmarSenha }})

        await act(async() => fireEvent.click(botaoAlterar) ) 

        expect(screen.getByText(/senha atual incorreta\./i)).toBeInTheDocument()
    })

    it("should redirect home if not authenticated", async () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            loading: false,
            login: jest.fn(),
            logout: jest.fn(),
            user: null
        })

        const pushMock = jest.fn();

        (useRouter as jest.Mock).mockReturnValue({
            push: pushMock
        });

        render(<AdminPasswordPage />)

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith("/");
        });
    })

})