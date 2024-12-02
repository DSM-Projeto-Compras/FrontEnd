/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { setupServer } from "msw/node";
import { http } from "msw";
import { env } from "../../../config/env"
import '@testing-library/jest-dom'

import HistoricTemplate from "../../../app/components/templates/historic/HistoricTemplate"
import HistoricPage from "../../../app/pages/historic/page";
import { useRouter } from "next/navigation";
import Header from "../../../app/components/organisms/Header";


jest.mock("next/navigation", () => ({
    useRouter: jest.fn()
}));

const server = setupServer(
    http.get(`${env.apiBaseUrl}/products`, () => {
        
            return Response.json({
                produtos: [
                    {
                        "_id": "609c1f1f1b8c8b3a85f4d5f5",  // ID fictício
                        "nome": 'Caneta Esferográfica',
                        "tipo": 'material-de-consumo',
                        "quantidade": 100,
                        "categoria": 'material-de-escritorio',
                        "descricao": 'Caneta esferográfica azul para escritório',
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

        jest.spyOn(Storage.prototype, 'removeItem')
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("should logout", () => {
        render(<Header admin={true} />);

        const botaoSair = screen.getByRole('button', { name: /sair/i });
        fireEvent.click(botaoSair);

        expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');

        expect(mockPush).toHaveBeenCalledWith('login');
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
    });
    afterAll(() => { 
        server.close()
    });
    afterEach(() => server.resetHandlers)

    it("should render product list", async () => {
        //pesquisa a página a partir do Template para construir a "base" para os dados
        render(<HistoricPage />);

        await waitFor(() => {
            screen.findByText("Esfereográfica")
            screen.findByText("sulfite")
        })
        
        //Pesquisa na tela da página por qualquer texto escrito como abaixo (título h1 definido)
        screen.getByText("Históricos dos produtos requisitados")
        
        screen.debug()
    })

    it("should open filter button", async () => {
        render(<HistoricPage />);
        const botao = screen.getByRole('button', {
            name: /abrir filtro/i
        })
        
        expect(screen.queryByRole('textbox', { name: /nome/i})).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/data inicial:/i)).not.toBeInTheDocument();

        fireEvent.click(botao);

        //screen.logTestingPlaygroundURL();

        screen.getByRole('textbox', {  name: /nome/i})

        screen.getByLabelText(/data inicial:/i)
    })

    it("should left the historic page", async () => {
        
        render(<HistoricPage />);

        await waitFor(() => {
            screen.findByRole('button', {
                name: /sair/i
            })
            screen.findByText(/cadastrar produto/i)
        })

        const botaoSair = screen.getByRole('button', {
            name: /sair/i
        })
        screen.debug();
        fireEvent.click(botaoSair);
        screen.debug()
    })


    /*it("should filter products by name", async () => {
        render(<HistoricPage />);

        //vendo primeiro os itens na tabela
        screen.findByRole("cell", {
            name: "Caneta"
        });
        screen.findByRole("cell", {
            name: "sulfite"
        });
        
        screen.debug();

        //clicando no botão de filtros
        const botao = screen.getByRole('button', {
            name: /abrir filtro/i
        })
        fireEvent.click(botao);

        //alterando o filtro para aparecer somente caneta
        const input = await screen.findByRole('textbox', {  name: /nome/i})
        fireEvent.change(input, { target: { value: "Caneta"}})

        screen.debug();
        
        await screen.findByRole("cell", {
            name: "Caneta"
        });

        
    })*/
})

