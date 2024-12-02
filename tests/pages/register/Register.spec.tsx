/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import mockRouter, { MemoryRouter } from "next-router-mock";
import { setupServer } from "msw/node";
import { http } from "msw";
import { env } from "../../../config/env"
import '@testing-library/jest-dom'

import LoginTemplate from "../../../app/components/templates/register/RegisterTemplate"
import RegisterPage from "../../../app/pages/register/page";

import Router from 'next/router'

jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock("next/navigation", () => require("next-router-mock"));

const server = setupServer(
    http.get(`${env.apiBaseUrl}/cadastro`, (_) => {
            const {nome, email, senha} = _.request as any;
            
            if(nome !== "userName" && nome !== "adminName") {
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
        mockRouter.setCurrentUrl("/cadastro")
        server.listen();
    });
    afterAll(() => { 
        server.close()
    });
    afterEach(() => server.resetHandlers)

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

        fireEvent.change(nameField, {target: {value:credentials.nome}})
        fireEvent.change(emailField, {target: {value:credentials.email}})
        fireEvent.change(passwordField, {target: {value:credentials.senha}})
        fireEvent.change(confirmpwdField, {target: {value:credentials.senhaErrada}})

        expect(emailField).toHaveValue(credentials.email);
        expect(passwordField).toHaveValue(credentials.senha);

        fireEvent.click(btnRegister);

        waitFor(() => expect(Router.push).toHaveBeenCalledWith(''), {timeout: 5000, interval: 100})
    })


    it("should throu an error", async () => {
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

        waitFor(() => expect(Router.push).toHaveAccessibleErrorMessage('As senhas não coincidem. Por favor, verifique.'), {timeout: 5000, interval: 100})
    })


})

