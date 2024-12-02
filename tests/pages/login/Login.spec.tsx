/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import mockRouter, { MemoryRouter } from "next-router-mock";
import { setupServer } from "msw/node";
import { http } from "msw";
import { env } from "../../../config/env"
import '@testing-library/jest-dom'

import LoginTemplate from "../../../app/components/templates/login/LoginTemplate"
import LoginPage from "../../../app/pages/login/page";

import Router from 'next/router'

jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock("next/navigation", () => require("next-router-mock"));

const server = setupServer(
    http.get(`${env.apiBaseUrl}/logins`, (_) => {
        //com isso não é preciso passar pelo token de autenticação
            const {email} = _.request as any;
            
            if(email === "erro@email.com") {
                return Response.json({
                    message: "aushuahs",
                },{status: 400});                
            }

            if(email === "admin@email.com") {
                return Response.json({
                    access_token: "aushuahs",
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
        mockRouter.setCurrentUrl("/logins")
        server.listen();
    });
    afterAll(() => { 
        server.close()
    });
    afterEach(() => server.resetHandlers)

    it("should show elements", async () => {
        render(<LoginPage />);
    
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


    it("should login", async () => {
        render(<LoginPage />);
        const credentials = {
            email: "user@email.com",
            senha: "senha@teste"
        }

        const emailField = screen.getByTestId("email");
        const passwordField = screen.getByTestId("password");
        // const rememberField = screen.getByTestId("remember");
        const btnLogin = screen.getByTestId("btnLogin");

        fireEvent.change(emailField, {target: {value:credentials.email}})
        fireEvent.change(passwordField, {target: {value:credentials.senha}})

        expect(emailField).toHaveValue(credentials.email);
        expect(passwordField).toHaveValue(credentials.senha);

        fireEvent.click(btnLogin);

        waitFor(() => expect(Router.push).toHaveBeenCalledWith('requisition'), {timeout: 5000, interval: 100})
    })


    it("should login admin", async () => {
        render(<LoginPage />);
        const credentials = {
            email: "admin@email.com",
            senha: "senha@teste"
        }

        const emailField = screen.getByTestId("email");
        const passwordField = screen.getByTestId("password");
        // const rememberField = screen.getByTestId("remember");
        const btnLogin = screen.getByTestId("btnLogin");

        fireEvent.change(emailField, {target: {value:credentials.email}})
        fireEvent.change(passwordField, {target: {value:credentials.senha}})

        expect(emailField).toHaveValue(credentials.email);
        expect(passwordField).toHaveValue(credentials.senha);

        fireEvent.click(btnLogin);

        waitFor(() => expect(Router.push).toHaveAccessibleErrorMessage("Erro ao fazer login. Verifique suas credenciais."), {timeout: 5000, interval: 100})
    })

    it("should throu an error", async () => {
        render(<LoginPage />);
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

        expect(emailField).toHaveValue(credentials.email);
        expect(passwordField).toHaveValue(credentials.senha);

        fireEvent.click(btnLogin);

        waitFor(() => expect(Router.push).toHaveBeenCalledWith('admin-dashboard'), {timeout: 5000, interval: 100})
    })


})

