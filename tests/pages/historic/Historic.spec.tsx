/* eslint-disable @typescript-eslint/no-require-imports */
import { render, screen, waitFor, fireEvent, act, within } from "@testing-library/react";
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
                "nome": 'Caneta Teste Azul',
                "tipo": 'material-de-consumo',
                "quantidade": 99,
                "categoria": 'material-de-escritorio',
                "descricao": 'Caneta teste azul para escritório',
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
            },

            {
                "_id": "609c1f1f1b8c8b3a85f4d5f7",  
                "nome": 'Caneta Teste Preta',
                "tipo": 'material-de-consumo',
                "quantidade": 70,
                "categoria": 'material-de-escritorio',
                "descricao": 'Caneta teste preta para escritório',
                "data": "2025-11-01T10:00:00.000Z",
                "userId": "674b5c719cc34fc0cc69a6e2",
                "justificativa": 'Quantidade muito alta para compra neste momento',
                "status": "Negado"
            },
            {
                "_id": "609c1f1f1b8c8b3a85f4d5f8",  
                "nome": 'Qudro branco',
                "tipo": 'material-permanente',
                "quantidade": 2,
                "categoria": 'material-de-escritorio',
                "descricao": 'Quadro branco para as salas superiores',
                "data": "2025-11-02T10:00:00.000Z",
                "userId": "674b5c719cc34fc0cc69a6e2",
                "justificativa": '',
                "status": "Aprovado"
            },
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
                        "nome": 'Caneta Teste Azul',
                        "tipo": 'material-de-consumo',
                        "quantidade": 99,
                        "categoria": 'material-de-escritorio',
                        "descricao": 'Caneta teste azul para escritório',
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
                    },
                    {
                        "_id": "609c1f1f1b8c8b3a85f4d5f7",  
                        "nome": 'Caneta Teste Preta',
                        "tipo": 'material-de-consumo',
                        "quantidade": 70,
                        "categoria": 'material-de-escritorio',
                        "descricao": 'Caneta teste preta para escritório',
                        "data": "2025-11-01T10:00:00.000Z",
                        "userId": "674b5c719cc34fc0cc69a6e2",
                        "justificativa": 'Quantidade muito alta para compra neste momento',
                        "status": "Negado"
                    },
                    {
                        "_id": "609c1f1f1b8c8b3a85f4d5f8",  
                        "nome": 'Qudro branco',
                        "tipo": 'material-permanente',
                        "quantidade": 2,
                        "categoria": 'material-de-escritorio',
                        "descricao": 'Quadro branco para as salas superiores',
                        "data": "2025-11-02T10:00:00.000Z",
                        "userId": "674b5c719cc34fc0cc69a6e2",
                        "justificativa": '',
                        "status": "Aprovado"
                    },
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

    it("should logout", async () => {
        const { logout } = useAuth();
        
        render(<Header admin={false} />);
        const botaoSair = screen.getByRole('button', { name: /sair/i });
        fireEvent.click(botaoSair);
        
        

        await waitFor(() => {
            expect(logout).toHaveBeenCalled();
            // expect(localStorage.removeItem).toHaveBeenCalledWith("access_token")
            expect(mockPush).toHaveBeenCalledWith('/');
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



describe.skip("Products Filter", () => {
    beforeAll(() => {
        //Antes do teste, resgata o mock definido como acima
        mockRouter.setCurrentUrl("/products")
        server.listen();
        jest.spyOn(requisitionService, "getProducts");
    });
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, user: { email: "user@fatec.sp.gov.br", cargo: "user"}, login: jest.fn(), logout: jest.fn() })
    })
    afterAll(() => { 
        server.close()
    });
    afterEach(() => {
        server.resetHandlers();
        jest.clearAllMocks();
    })

    it("should render product list without filter", async () => {

        //pesquisa a página a partir do Template para construir a "base" para os dados
        //act garante atualizações de estado e espera a render
        await act( async () => {
            render(<HistoricPage />);
        })  

        const caneta = screen.getByText("Caneta Teste Azul");
        const papel = screen.getByText(/papel sulfite a4 par\.\.\./i)

        await waitFor(() => {
            expect(caneta).toBeInTheDocument()
            expect(papel).toBeInTheDocument()
        })

        //Pesquisa na tela da página por qualquer texto escrito como abaixo (título h1 definido)
        expect(screen.getByText("Históricos dos produtos requisitados")).toBeInTheDocument()
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
            render(<HistoricPage />);
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
        
        screen.getByText(/caneta teste azul pa\.\.\./i)
        expect(screen.queryByText("sulfite")).not.toBeInTheDocument(); 
    })

})

describe("Products List", () => {
    beforeAll(() => {
        //Antes do teste, resgata o mock definido como acima
        mockRouter.setCurrentUrl("/products")
        server.listen();
        jest.spyOn(requisitionService, "getProducts");
    });
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, user: { email: "user@fatec.sp.gov.br", cargo: "user"}, login: jest.fn(), logout: jest.fn() })
    })
    afterAll(() => { 
        server.close()
    });
    afterEach(() => {
        server.resetHandlers();
        jest.clearAllMocks();
    })

    it("should render 'denied', 'approved' and 'pendent' products on list", async () => {

        await act( async () => {
            render(<HistoricPage />);
        })  

        const row = screen.getByRole('row', {
             name: /papel sulfite papel sulfite a4 par\.\.\. 50 01\/12\/2023 pendente abrir menu/i
        });

        const caneta = screen.getByText("Caneta Teste Preta");
        const pendente = within(row).getByText(/pendente/i); //para valores repetidos isolar uma célula da tabela
        const aprovado = screen.getByText("Aprovado");
        const negado = screen.getByText("Negado");

        expect(caneta).toBeVisible()
        expect(pendente).toBeVisible()
        expect(aprovado).toBeVisible()
        expect(negado).toBeVisible()
    })

    it("should open details modal on pendent item", async () => {
        await act( async() => {
            render(<HistoricPage />)
        })

        const rowCanetaAzul = screen.getByRole('row', {
            name: /caneta teste azul caneta teste azul pa\.\.\. 99 01\/12\/2023 pendente abrir menu/i
        });

        const opcoesCanetaAzul = within(rowCanetaAzul).getByRole('button', {
            name: /abrir menu/i
        });

        fireEvent.click(opcoesCanetaAzul)

        const rowDetails = screen.getByRole('row', {
            name: /caneta teste azul caneta teste azul pa\.\.\. 99 01\/12\/2023 pendente abrir menu ver detalhes editar cancelar/i
        });

        const detalhesCanetaAzul = within(rowDetails).getByText(/ver detalhes/i);

        fireEvent.click(detalhesCanetaAzul)

        const tituloDetalhes = screen.getByText("Detalhes do Produto")

        expect(tituloDetalhes).toBeInTheDocument();
    })

    it("should edit pendent item details", async () => {
        await act( async() => {
            render(<HistoricPage />)
        })

        const rowPapel = screen.getByRole('row', {
            name: /papel sulfite papel sulfite a4 par\.\.\. 50 01\/12\/2023 pendente abrir menu/i
        });

        const opcoesPapel = within(rowPapel).getByText(/abrir menu/i);

        fireEvent.click(opcoesPapel)

        const rowDetails = screen.getByRole('row', {
            name: /papel sulfite papel sulfite a4 par\.\.\. 50 01\/12\/2023 pendente abrir menu ver detalhes editar cancelar/i
        });

        const editarPapel = within(rowDetails).getByText(/editar/i);

        fireEvent.click(editarPapel)

        const tituloEditar = screen.getByRole('heading', {  name: /editar produto/i})
        const btnSalvar = screen.getByRole('button', {  name: /salvar/i})
        const inputQtd = screen.getByRole('spinbutton')
        const inputDescricao = screen.getByRole('textbox')

        expect(tituloEditar).toBeInTheDocument()
        expect(btnSalvar).toBeInTheDocument()

        fireEvent.change(inputQtd, { target: {value: "12"}})
        fireEvent.change(inputDescricao, { target: {value: "descricao editada"}})

        fireEvent.click(btnSalvar)

        screen.debug()
        screen.logTestingPlaygroundURL()
    })
})

