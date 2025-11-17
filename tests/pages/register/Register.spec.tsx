/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock("next/navigation", () => require("next-router-mock"));

const MOCKED_API_URL = "http://localhost:4000/api";

jest.mock("../../../config/env", () => ({
    env: {
        apiBaseUrl: MOCKED_API_URL
    }
}))


import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { setupServer } from "msw/node";
import { http } from "msw";
import { env } from "../../../config/env"
import '@testing-library/jest-dom'

import RegisterPage from "../../../app/pages/register/page";

import Router from 'next/router'


interface RegisterBody {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
}

// Handler de Registro
const handleRegisterRequest = async ({ request }: { request: Request }) => {
    const body = await request.json() as RegisterBody;
    const { nome } = body;
    
    // Simula erro de servidor
    if(nome !== "Usuário teste") {
        return Response.json({
            message: "Erro no servidor (Nome não corresponde)",
        },{status: 400});                
    }

    // Simula registro bem-sucedido
    return Response.json({
        message: "Usuário registrado com sucesso!",
    }, { status: 201 });
};

const server = setupServer(
    http.post<any, RegisterBody, any>(`${env.apiBaseUrl}/logins/cadastro`, handleRegisterRequest),

    http.post<any, RegisterBody, any>(`/logins/cadastro`, handleRegisterRequest)
)


describe("Login Page Elements", () => {
    beforeAll(() => {
        server.listen();
    });
    afterAll(() => { 
        server.close()
    });
    afterEach(() => {
        server.resetHandlers();
        (Router.push as jest.Mock).mockClear();
        act(() => {
            mockRouter.setCurrentUrl("/");
        });

    })

    it("should render elements", async () => {
        render(<RegisterPage />);
    
        const nameField = screen.getByTestId("name");
        const emailField = screen.getByTestId("email");
        const passwordField = screen.getByTestId("password");
        const confirmpwdField = screen.getByTestId("confirmPassword");
        const btnRegister = screen.getByTestId("btnRegister");
    
        // Verificar se os elementos estão visíveis
        expect(nameField).toBeVisible();
        expect(emailField).toBeVisible();
        expect(passwordField).toBeVisible();
        expect(confirmpwdField).toBeVisible();
        expect(btnRegister).toBeVisible();
    });


    it("should register succesfully and navigate to /login", async () => {
        render(<RegisterPage />);
        const credentials = {
            nome: "Usuário teste",
            email: "user@fatec.sp.gov.br",
            senha: "Senha@teste123",
            confirmarSenha: "Senha@teste123"
        }

        const nameField = screen.getByTestId("name");
        const emailField = screen.getByTestId("email");
        const passwordField = screen.getByTestId("password");
        const confirmpwdField = screen.getByTestId("confirmPassword");
        const btnRegister = screen.getByTestId("btnRegister");

        fireEvent.change(nameField, {target: {value:credentials.nome}})
        fireEvent.change(emailField, {target: {value:credentials.email}})
        fireEvent.change(passwordField, {target: {value:credentials.senha}})
        fireEvent.change(confirmpwdField, {target: {value:credentials.confirmarSenha}})

        fireEvent.click(btnRegister);

        const modalButton = await screen.findByText("Fazer Login");
        expect(modalButton).toBeVisible()
        expect(screen.getByText("Cadastro realizado com sucesso!")).toBeVisible()

        fireEvent.click(modalButton);


        await waitFor(() => expect(mockRouter.asPath).toEqual("/"), {timeout: 5000, interval: 100})
    })


    it("should throw a password error (passwords mismatch", async () => {
        render(<RegisterPage />);
        const credentials = {
            nome: "user",
            email: "user@email.com",
            senha: "senha@teste",
            senhaErrada: "senhaaaa"
        }

        const nameField = screen.getByTestId("name");
        const emailField = screen.getByTestId("email");
        const passwordField = screen.getByTestId("password");
        const confirmpwdField = screen.getByTestId("confirmPassword");
        const btnRegister = screen.getByTestId("btnRegister");

        fireEvent.change(nameField, {target: {value:credentials.nome} })
        fireEvent.change(emailField, {target: {value:credentials.email}})
        fireEvent.change(passwordField, {target: {value:credentials.senha}})
        fireEvent.change(confirmpwdField, {target: {value:credentials.senhaErrada}})

        fireEvent.click(btnRegister);

        const errorMessage = await screen.findByText("As senhas não correspondem")

        expect(errorMessage).toBeVisible();

        expect(mockRouter.asPath).toEqual("/");

        // screen.debug();

        // await waitFor(() => expect(Router.push).toHaveAccessibleErrorMessage('As senhas não coincidem. Por favor, verifique.'), {timeout: 5000, interval: 100})
    })

    // it("should throw a server error", () => {

    // })


})

