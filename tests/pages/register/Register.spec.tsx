/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock("next/navigation", () => require("next-router-mock"));

const MOCKED_API_URL = "http://localhost:4000/api";

jest.mock("../../../config/env", () => ({
    env: {
        apiBaseUrl: MOCKED_API_URL
    }
}))


import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import mockRouter, { MemoryRouter } from "next-router-mock";
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

const server = setupServer(
    http.get<any, RegisterBody, any>(`${env.apiBaseUrl}/cadastro`, async ({ request }) => {

            const body = await request.json() as RegisterBody;
            const { nome, email, senha, confirmarSenha } = body;
            
            if(nome !== "userName" && nome !== "adminName") {
                return Response.json({
                    message: "Erro no servidor",
                },{status: 400});                
            }

            if(email === "admin@fatec.sp.gov.br") {
                return Response.json({
                    access_token: "token_admin",
                    cargo: "admin"
                });                
            }
        
            return Response.json({
                access_token: "access_token",
                cargo: "user"
            });
        }
    ),
)


describe("Login Page Elements", () => {
    beforeAll(() => {
        //Antes do teste, resgata o mock definido como acima
        mockRouter.setCurrentUrl("/cadastro")
        server.listen();
    });
    afterAll(() => { 
        server.close()
    });
    afterEach(() => server.resetHandlers())

    it("should show elements", async () => {
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


    it("should register", async () => {
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

        await waitFor(() => expect(Router.push).toHaveBeenCalledWith(''), {timeout: 5000, interval: 100})
    })


    it("should throw an error", async () => {
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

        fireEvent.change(passwordField, {target: {value:credentials.senha}})
        fireEvent.change(confirmpwdField, {target: {value:credentials.senhaErrada}})

        expect(passwordField).toHaveValue(credentials.senha);
        expect(confirmpwdField).toHaveValue(credentials.senhaErrada);

        fireEvent.click(btnRegister);

        const errorMessage = await screen.findByText("As senhas não correspondem")

        expect(errorMessage).toBeVisible();

        expect(Router.push).not.toHaveBeenCalled();

        // screen.debug();

        // await waitFor(() => expect(Router.push).toHaveAccessibleErrorMessage('As senhas não coincidem. Por favor, verifique.'), {timeout: 5000, interval: 100})
    })


})

