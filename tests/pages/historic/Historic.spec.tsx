/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, waitFor } from "@testing-library/react";
import mockRouter from "next-router-mock";
import { setupServer } from "msw/node";
import { http } from "msw";
import { env } from "../../../config/env"

import HistoricTemplate from "../../../app/components/templates/historic/HistoricTemplate"

jest.mock("next/navigation", () => require("next-router-mock"));

const server = setupServer(

    http.get(`${env.apiBaseUrl}/products`, () => {
        //mock que pega do arquivo .env o caminho da API
        //com isso não é preciso passar pelo token de autenticação
        return Response.json({
            produtos: [
                {
                    "_id": "609c1f1f1b8c8b3a85f4d5f5",  // ID fictício para representar o MongoDB
                    "nome": 'Caneta Esferográfica',
                    "tipo": 'material-de-consumo',
                    "quantidade": 100,
                    "categoria": 'material-de-escritorio',
                    "descricao": 'Caneta esferográfica azul para escritório',
                    "userId": "60d21b4667d0d8992e610c85",  // Exemplo de ObjectId de um usuário
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
    }),
)

describe("Products List Page", () => {

    beforeAll(() => {
        //Antes do teste, resgata o mock definido como acima
        mockRouter.setCurrentUrl("/products")
        server.listen();
    });
    afterAll(() => { server.close()});

    it("should render product list", async () => {
        //pesquisa a página a partir do Template para construir a "base" para os dados
        render(<HistoricTemplate />);

        //Pesquisa na tabela da página por uma célula contendo "Esfereográfica" como dito no mock
        screen.findByRole("cell", {
            name: "Esfereográfica"
        });

        screen.findByRole("cell", {
            name: "sulfite"
        })

        //Pesquisa na tela da página por qualquer texto escrito como abaixo (título h1 definido)
        screen.getByText("Históricos dos produtos requisitados")

        screen.logTestingPlaygroundURL();
    })

})
