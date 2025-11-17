/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('next/router', ()=> ({push: jest.fn(), onLogin: jest.fn()}))
jest.mock("next/navigation", () => require("next-router-mock"));

const MOCKED_API_URL = "http://localhost:4000/api";

jest.mock("../../../config/env", () => ({
    env: {
        apiBaseUrl: MOCKED_API_URL
    }
}))


import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http } from "msw";

import '@testing-library/jest-dom'

import LoginPage from "../../../app/pages/login/page";
import { env } from "../../../config/env"

import Router from 'next/router'
import mockRouter from "next-router-mock";
import { AuthProvider } from "../../../app/contexts/AuthContext";


interface LoginBody {
    email: string;
    password: string;
    remember: boolean;
}

const server = setupServer(
    http.post<any, LoginBody, any>(`${env.apiBaseUrl}/logins`, async ({ request }) => {
        //com isso não é preciso passar pelo token de autenticação

            const body = await request.json() as LoginBody;
            const { email } = body;
            
            if(email === "erro@email.com") {
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
    http.get(`${env.apiBaseUrl}/logins/me`, (req) => {
        const authHeader = req.request.headers.get("Authorization");
        if (authHeader === "Bearer token_admin") {
            return Response.json({
                email: "admin@fatec.sp.gov.br",
                cargo: "admin"
            });
        } else if (authHeader === "Bearer access_token") {
            return Response.json({
                email: "user.teste@fatec.sp.gov.br",
                cargo: "user"
            });
        }

        return Response.json({
            message: "Unauthorized"
        }, { status: 401 });
    })
);



describe.skip("Login Page Elements", () => {
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
    });


    it("should show elements", async () => {
        render(
        <AuthProvider>
            <LoginPage />
        </AuthProvider>
        );

    
        const emailField = screen.getByTestId("email");
        const passwordField = screen.getByTestId("password");
        const rememberField = screen.getByTestId("remember");
        const btnLogin = screen.getByTestId("btnLogin");
    
        // Verificar se os elementos estão visíveis
        expect(emailField).toBeVisible();
        expect(passwordField).toBeVisible();
        expect(rememberField).toBeVisible();
        expect(btnLogin).toBeVisible();
    });


    it("should login user and navigate to /requisition", async () => {
        render(
        <AuthProvider>
            <LoginPage />
        </AuthProvider>
        );

        const credentials = {
            email: "user.teste@fatec.sp.gov.br",
            senha: "Senha@teste123"
        }   

        const emailField = screen.getByLabelText(/email/i)
        const passwordField = screen.getByLabelText(/senha/i)
        // const rememberField = screen.getByTestId("remember");
        const btnLogin = screen.getByRole('button', {
            name: /fazer login/i
          })

        fireEvent.change(emailField, {target: {value:credentials.email}})
        fireEvent.change(passwordField, {target: {value:credentials.senha}})

        fireEvent.click(btnLogin);

        await waitFor(() => expect(mockRouter.asPath).toEqual('/requisition'), {timeout: 5000, interval: 100})
    })


    it("should login admin and navigate to /admin-dashboard", async () => {
        render(
        <AuthProvider>
            <LoginPage />
        </AuthProvider>
        );
        const credentials = {
            email: "admin@fatec.sp.gov.br",
            senha: "Admin@teste123"
        }

        // screen.logTestingPlaygroundURL();
        // screen.debug();

        const emailField = screen.getByTestId("email");
        const passwordField = screen.getByTestId("password");
        // const rememberField = screen.getByTestId("remember");
        const btnLogin = screen.getByTestId("btnLogin");

        

        fireEvent.change(emailField, {target: {value:credentials.email}})
        fireEvent.change(passwordField, {target: {value:credentials.senha}})

        // expect(emailField).toHaveValue(credentials.email);
        // expect(passwordField).toHaveValue(credentials.senha);

        fireEvent.click(btnLogin);

        await waitFor(() => expect(mockRouter.asPath).toEqual('/admin-dashboard'), {timeout: 5000, interval: 100})
    })

    it("should throw an error and display message", async () => {
        render(
        <AuthProvider>
            <LoginPage />
        </AuthProvider>
        );
        const credentials = {
            email: "erro@email.com",
            senha: "senha@teste"
        }

        const emailField = screen.getByTestId("email");
        const passwordField = screen.getByTestId("password");
        // const rememberField = screen.getByTestId("remember");
        const btnLogin = screen.getByTestId("btnLogin");

        fireEvent.change(emailField, {target: {value:credentials.email}})
        fireEvent.change(passwordField, {target: {value:credentials.senha}})

        // expect(emailField).toHaveValue(credentials.email);
        // expect(passwordField).toHaveValue(credentials.senha);

        fireEvent.click(btnLogin);

        const errorMessage = await screen.findByText("Erro ao fazer login. Verifique suas credenciais.");

        expect(errorMessage).toBeVisible();

        expect(Router.push).not.toHaveBeenCalled();
        // await waitFor(() => expect(Router.push).toHaveBeenCalledWith('admin-dashboard'), {timeout: 5000, interval: 100})
    })


})

