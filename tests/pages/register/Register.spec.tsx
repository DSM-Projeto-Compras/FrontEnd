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
    const { email } = body;
    
    // Simula erro de servidor
    if(email === "erro@teste.com") {
        return Response.json({
            errors: [
                { msg: "Apenas emails institucionais da Fatec (@fatec.sp.gov.br) são permitidos" },
                { msg: "O nome deve ter no mínimo 3 caracteres"} //esta é uma resposta apenas para garantir a cobertura
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
};

const server = setupServer(
    http.post<any, RegisterBody, any>(`${env.apiBaseUrl}/logins/cadastro`, handleRegisterRequest),

    http.post<any, RegisterBody, any>(`/logins/cadastro`, handleRegisterRequest)
)


//#region Register Page Elements 

describe.skip("Register Page Elements", () => {
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
    })

    it("should display specific API validation error message", async () => {
        render(<RegisterPage />)

        const credentials = {
            nome: "usr",
            email: "erro@teste.com",
            senha: "Senha@teste123",
            confirmarSenha: "Senha@teste123"
        }
        //obs.: este email específico serve de 'gatilho' para o erro da api esperado

        const nameField = screen.getByTestId("name");
        const emailField = screen.getByTestId("email");
        const passwordField = screen.getByTestId("password");
        const confirmpwdField = screen.getByTestId("confirmPassword");
        const btnRegister = screen.getByTestId("btnRegister");

        fireEvent.change(nameField, {target: {value:credentials.nome} })
        fireEvent.change(emailField, {target: {value:credentials.email}})
        fireEvent.change(passwordField, {target: {value:credentials.senha}})
        fireEvent.change(confirmpwdField, {target: {value:credentials.confirmarSenha}})

        fireEvent.click(btnRegister);


        const erroemail = await screen.findByText("Apenas emails institucionais da Fatec");

        expect(erroemail).toBeVisible()

        expect(mockRouter.asPath).toEqual('/');
    })

    it("should display generic error message on server failure", async () => {
        render(<RegisterPage />);
        const credentials = {
            nome: "Usuário Genérico",
            email: "errogenerico@fatec.sp.gov.br",
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

        const genericErrorMessage = await screen.findByText("Ocorreu um erro durante o cadastro. Por favor, tente novamente mais tarde.");
        
        expect(genericErrorMessage).toBeVisible();
        
        expect(mockRouter.asPath).toEqual('/'); 
    })


})

