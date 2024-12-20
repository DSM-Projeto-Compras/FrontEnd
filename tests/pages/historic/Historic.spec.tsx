/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { setupServer } from "msw/node";
import { http } from "msw";
import { env } from "../../../config/env"
import '@testing-library/jest-dom'

import HistoricPage from "../../../app/pages/historic/page";
import { useRouter } from "next/navigation";
import Header from "../../../app/components/organisms/Header";
import requisitionService from "../../../app/services/requisitionService";
import HistoricTemplate from "../../../app/components/templates/historic/HistoricTemplate";
import { useAuth } from "../../../app/contexts/AuthContext";

jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("../../../app/contexts/AuthContext", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../../../app/services/requisitionService", () => ({
    getProducts: jest.fn().mockResolvedValue(
        //para ser captado pelo render, não deve estar em um objeto:
        [
            {
                "_id": "609c1f1f1b8c8b3a85f4d5f5",  // ID fictício
                "nome": 'Caneta Esferográfica',
                "tipo": 'material-de-consumo',
                "quantidade": 100,
                "categoria": 'material-de-escritorio',
                "descricao": 'Caneta esferográfica azul para escritório',
                "data": "2023-12-01T10:00:00.000Z",
                "userId": "674b5c719cc34fc0cc69a6e2",
                "justificativa": '',
                "status": "Pendente",
            },
            {
                "_id": "609c1f1f1b8c8b3a85f4d5f6",
                "nome": 'Papel sulfite',
                "tipo": 'material-de-consumo',
                "quantidade": 50,
                "categoria": 'material-de-escritorio',
                "descricao": 'Papel sulfite A4 para material escolar',
                "data": "2023-12-01T10:00:00.000Z",
                "userId": "674b5c719cc34fc0cc69a6e2",
                "justificativa": '',
                "status": "Pendente"
            }
        ],
    )
}))

const server = setupServer(
    http.get(`${env.apiBaseUrl}/products`, () => {
            return Response.json({
                access_token: "access_token",
                cargo: "user",
                products: [
                    {
                        "_id": "609c1f1f1b8c8b3a85f4d5f5",  // ID fictício
                        "nome": 'Caneta Esferográfica',
                        "tipo": 'material-de-consumo',
                        "quantidade": 100,
                        "categoria": 'material-de-escritorio',
                        "descricao": 'Caneta esferográfica azul para escritório',
                        "data": "2023-12-01T10:00:00.000Z",
                        "userId": "60d21b4667d0d8992e610c85",
                        "justificativa": '',
                        "status": "Pendente",
                    },
                    {
                        "_id": "609c1f1f1b8c8b3a85f4d5f6",
                        "nome": 'Papel sulfite',
                        "tipo": 'material-de-consumo',
                        "quantidade": 50,
                        "categoria": 'material-de-escritorio',
                        "descricao": 'Papel sulfite A4 para material escolar',
                        "data": "2023-12-01T10:00:00.000Z",
                        "userId": "60d21b4667d0d8992e610c85",
                        "justificativa": '',
                        "status": "Pendente"
                    }
                ],
            });
        }
    ),
)

describe("Header Component", () => {
    //obs: aqui está sendo testado o Header, mas levando em consideração que está com uma estrutura única para a página de Histórico
    let mockPush: jest.Mock;

    beforeEach(() => {
        mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, user: { email: "felipe@email.com", cargo: "user"}, login: jest.fn(), logout: jest.fn() })

        jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it.skip("should logout", async () => {
        const { logout } = useAuth();
        
        render(<Header admin={false} />);
        const botaoSair = screen.getByRole('button', { name: /sair/i });
        fireEvent.click(botaoSair);
        
        

        await waitFor(() => {
            expect(logout).toHaveBeenCalled();
            expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
            expect(mockPush).toHaveBeenCalledWith('login');
        })
    })

    it("should change page and display logos", async () => {
        render(<Header admin={false} />);

        screen.getByRole('img', {
            name: /logo fatec/i
        })
        screen.getByRole('img', {
            name: /logo cps/i
        })

        const abaProdutos = screen.getByText(/cadastrar produto/i);
        const abaHistorico = screen.getByText(/histórico/i);

        fireEvent.click(await abaProdutos);
        expect(mockPush).toHaveBeenCalledWith('requisition');

        fireEvent.click(await abaHistorico);
        expect(mockPush).toHaveBeenCalledWith('historic')
    })
})

describe("Products List Page", () => {
    beforeAll(() => {
        //Antes do teste, resgata o mock definido como acima
        mockRouter.setCurrentUrl("/products")
        server.listen();
        jest.spyOn(requisitionService, "getProducts");
    });
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, user: { email: "felipe@email.com", cargo: "user"}, login: jest.fn(), logout: jest.fn() })
    })
    afterAll(() => { 
        server.close()
    });
    afterEach(() => {
        server.resetHandlers;
        jest.clearAllMocks();
    })

    it("should render product list", async () => {

        

        //pesquisa a página a partir do Template para construir a "base" para os dados
        //act garante atualizações de estado e espera a render
        await act( async () => {
            render(<HistoricTemplate />);
        })  

        await waitFor(() => {
            screen.findByText("Esfereográfica")
            screen.findByText("sulfite")
        })
        
        //Pesquisa na tela da página por qualquer texto escrito como abaixo (título h1 definido)
        screen.getByText("Históricos dos produtos requisitados")
        
        //screen.debug()
    })

    it("should open filter button", async () => {
        await act( async () => {
            render(<HistoricTemplate />);
        })
        const botao = screen.getByRole('button', {
            name: /abrir filtro/i
        })
        
        expect(screen.queryByRole('textbox', { name: /nome/i})).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/data inicial:/i)).not.toBeInTheDocument();
        expect(screen.queryByRole('combobox', {  name: /categoria/i})).not.toBeInTheDocument();

        fireEvent.click(botao);

        //screen.logTestingPlaygroundURL();

        screen.getByRole('textbox', {  name: /nome/i})
        screen.getByLabelText(/data inicial:/i)
        screen.getByRole('combobox', {  name: /categoria/i})
        screen.getByRole('radio', {
            name: /pendente/i
        })
        screen.getByLabelText(/data inicial:/i)
    })

    it("should filter products by name", async () => {
        await act( async () => {
            render(<HistoricTemplate />);
        })

        const botaoAbrir = screen.getByRole('button', {
            name: /abrir filtro/i
        })

        screen.getByText(/papel sulfite a4 par\.\.\./i)

        fireEvent.click(botaoAbrir);
        
        const botaoFechar = screen.getByRole('button', {
            name: /fechar filtro/i
        })

        const inputName = await screen.findByRole('textbox', {  name: /nome/i})

        fireEvent.change(inputName, {  target: {value: "Caneta"} })

        
        fireEvent.click(botaoFechar);
        
        screen.getByText(/caneta esferográfica\.\.\./i)
        expect(screen.queryByText("sulfite")).not.toBeInTheDocument();
        
    })
})

