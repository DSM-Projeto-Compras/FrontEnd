/* eslint-disable @typescript-eslint/no-require-imports */
const mockProducts = [
    {
        "id": "609c1f1f1b8c8b3a85f4d5f5",  // ID fictício
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
        "id": "609c1f1f1b8c8b3a85f4d5f6",
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
        "id": "609c1f1f1b8c8b3a85f4d5f7",  
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
        "id": "609c1f1f1b8c8b3a85f4d5f8",  
        "nome": 'Qudro branco',
        "tipo": 'material-permanente',
        "quantidade": 2,
        "categoria": 'materiais-didaticos-pedagogicos',
        "descricao": 'Quadro branco para as salas superiores',
        "data": "2025-11-02T10:00:00.000Z",
        "userId": "674b5c719cc34fc0cc69a6e2",
        "justificativa": '',
        "status": "Aprovado"
    },

    {
        "id": "609c1f1f1b8c8b3a85f4d5f9",  
        "nome": 'Quadro verde',
        "tipo": 'material-permanente',
        "quantidade": 2,
        "categoria": 'materiais-didaticos-pedagogicos',
        "descricao": 'Quadro verde para as salas superiores',
        "data": "2025-11-02T10:00:00.000Z",
        "userId": "674b5c719cc34fc0cc69a6e2",
        "justificativa": '',
        "status": "Pendente"
    },
    {
        "id": "609c1f1f1b8c8b3a85f4d5f03",  
        "nome": 'Quadro amarelo',
        "tipo": 'material-permanente',
        "quantidade": 2,
        "categoria": 'materiais-didaticos-pedagogicos',
        "descricao": 'Quadro amarelo para as salas superiores',
        "data": "2025-11-02T10:00:00.000Z",
        "userId": "674b5c719cc34fc0cc69a6e2",
        "justificativa": '',
        "status": "Pendente"
    },
    {
        "id": "609c1f1f1b8c8b3a85f4d5f02",  
        "nome": 'Quadro azul',
        "tipo": 'material-permanente',
        "quantidade": 2,
        "categoria": 'materiais-didaticos-pedagogicos',
        "descricao": 'Quadro azul para as salas superiores',
        "data": "2025-11-02T10:00:00.000Z",
        "userId": "674b5c719cc34fc0cc69a6e2",
        "justificativa": '',
        "status": "Pendente"
    },
    {
        "id": "609c1f1f1b8c8b3a85f4d5f01",  
        "nome": 'Quadro vermelho',
        "tipo": 'material-permanente',
        "quantidade": 2,
        "categoria": 'materiais-didaticos-pedagogicos',
        "descricao": 'Quadro vermelho para as salas superiores',
        "data": "2025-11-02T10:00:00.000Z",
        "userId": "674b5c719cc34fc0cc69a6e2",
        "justificativa": '',
        "status": "Pendente"
    },
]

import { render, screen, waitFor, fireEvent, act, within } from "@testing-library/react";
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
    getProducts: jest.fn().mockResolvedValue(mockProducts),
    updateProduct: jest.fn().mockResolvedValue({}),
    deleteProduct: jest.fn().mockResolvedValue({}) 
}))

const server = setupServer(
    http.get(`${env.apiBaseUrl}/products`, () => {
            return Response.json({
                access_token: "access_token",
                cargo: "user",
                products: mockProducts
            });
        }
    ),
)

//#region describe Header Component

describe.skip("Header Component", () => {
    //obs: aqui está sendo testado o Header, mas levando em consideração que está com uma estrutura única para a página de Histórico
    let mockPush: jest.Mock;
    let mockLogout: jest.Mock;

    beforeEach(() => {
        mockPush = jest.fn();
        mockLogout = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        (useAuth as jest.Mock).mockReturnValue({ 
            isAuthenticated: true, 
            user: { email: "felipe@email.com", cargo: "user"}, 
            login: jest.fn(), 
            logout: mockLogout })

        jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("should logout", async () => {
        render(<Header admin={false} />);
        const botaoSair = screen.getByRole('button', { name: /sair/i });
        fireEvent.click(botaoSair);
        
        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();
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

//#endregion describe Header Component
//#region describe Products List

describe.skip("Products List", () => {
    const getProductsMock = requisitionService.getProducts as jest.Mock;
    const updateProductMock = requisitionService.updateProduct as jest.Mock;
    const deleteProductMock = requisitionService.deleteProduct as jest.Mock;

    beforeAll(() => {
        server.listen();
    });
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ 
            isAuthenticated: true, 
            user: { email: "user@fatec.sp.gov.br", cargo: "user"}, 
            login: jest.fn(), 
            logout: jest.fn() 
        })
        getProductsMock.mockClear();
        updateProductMock.mockClear();
        deleteProductMock.mockClear();
        getProductsMock.mockResolvedValue(mockProducts);
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

    it("should close options modal on clicking out", async () => {
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

        const editar = screen.getByText(/editar/i)

        const celula = screen.getByRole('cell', {
            name: /caneta teste preta p\.\.\./i
        })

        expect(editar).toBeInTheDocument()

        fireEvent.click(document.body)
        fireEvent.click(celula)

        // expect(editar).not.toBeInTheDocument();
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

        act(() => fireEvent.click(opcoesCanetaAzul))

        const rowDetails = screen.getByRole('row', {
            name: /caneta teste azul caneta teste azul pa\.\.\. 99 01\/12\/2023 pendente abrir menu ver detalhes editar cancelar/i
        });

        const detalhesCanetaAzul = within(rowDetails).getByText(/ver detalhes/i);

        act(() => fireEvent.click(detalhesCanetaAzul))

        const tituloDetalhes = screen.getByText("Detalhes do Produto")

        expect(tituloDetalhes).toBeInTheDocument();

        const botaoFechar = screen.getByRole('button', { name: /fechar/i });
        act(() => fireEvent.click(botaoFechar));

        await waitFor(() => {
            expect(screen.queryByText("Detalhes do Produto")).not.toBeInTheDocument();
        });
    })

    it("should edit pendent item details and call API", async () => {
        await act( async() => {
            render(<HistoricPage />)
        })

        const rowPapel = screen.getByRole('row', {
            name: /papel sulfite papel sulfite a4 par\.\.\. 50 01\/12\/2023 pendente abrir menu/i
        });

        const opcoesPapel = within(rowPapel).getByRole('button', { name: /abrir menu/i });

        fireEvent.click(opcoesPapel)

        const rowDetails = screen.getByRole('row', {
            name: /papel sulfite papel sulfite a4 par\.\.\. 50 01\/12\/2023 pendente abrir menu ver detalhes editar cancelar/i
        });

        const editarPapel = within(rowDetails).getByText(/editar/i);

        fireEvent.click(editarPapel)
        

        const tituloEditar = screen.getByRole('heading', {  name: /editar produto/i })
        const btnSalvar = screen.getByRole('button', {  name: /salvar/i })
        const inputQtd = screen.getByRole('spinbutton')
        const inputDescricao = screen.getByRole('textbox')

        expect(tituloEditar).toBeInTheDocument()
        expect(btnSalvar).toBeInTheDocument()

        await act(async () => {
            fireEvent.change(inputQtd, { target: {value: "12"}})
            fireEvent.change(inputDescricao, { target: {value: "descricao editada"}})

            fireEvent.click(btnSalvar)
        })

        await waitFor(() => {
            expect(updateProductMock).toHaveBeenCalledWith({
                id: "609c1f1f1b8c8b3a85f4d5f6",
                quantidade: 12,
                descricao: "descricao editada"
            });

            expect(screen.queryByRole('heading', {  name: /editar produto/i})).not.toBeInTheDocument(); //ver se a janela de edição fecha
        })
        
    })

    it("should delete pendent item and call API", async () => {
        await act(async() => {
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

        const opcaoCancelar = within(rowDetails).getByText(/cancelar/i);

        fireEvent.click(opcaoCancelar)

        
        // #region TODO deletar item
    })

    it("should open justification modal on denied item", async () => {
        await act(async() => {
            render(<HistoricPage />)
        })

        const rowCanetaPreta = screen.getByRole('row', {
            name: /caneta teste preta caneta teste preta p\.\.\. 70 01\/11\/2025 negado abrir menu/i
        });

        const opcoesCanetaPreta = within(rowCanetaPreta).getByText(/abrir menu/i);

        fireEvent.click(opcoesCanetaPreta)

        const opcaoJustificativa = screen.getByText(/ver justificativa/i)

        fireEvent.click(opcaoJustificativa)

        const tituloDetalhes = screen.getByText("Detalhes do Produto")
        const justificativa = screen.getByText("Quantidade muito alta para compra neste momento")
        expect(tituloDetalhes).toBeInTheDocument();
        expect(justificativa).toBeInTheDocument();

        const botaoFechar = screen.getByRole('button', {  name: /fechar/i})
        fireEvent.click(botaoFechar)

        await waitFor(() => {
            expect(screen.queryByText("Quantidade muito alta para compra neste momento")).not.toBeInTheDocument();
        })
    })

})


//#region Describe products filter


describe.skip("Products Filter", () => {
    const getProductsMock = requisitionService.getProducts as jest.Mock;

    beforeAll(() => {
        //Antes do teste, resgata o mock definido como acima
        server.listen();
    });
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ 
            isAuthenticated: true, 
            user: { email: "user@fatec.sp.gov.br", cargo: "user"}, 
            login: jest.fn(), 
            logout: jest.fn() 
        })
        getProductsMock.mockClear();
        getProductsMock.mockResolvedValue(mockProducts);
    })
    afterAll(() => { 
        server.close()
    });
    afterEach(() => {
        server.resetHandlers();
        jest.clearAllMocks();
    })

    it("should render product list without filter", async () => {

        //pesquisa a página a partir do Template em Page para construir a "base" para os dados
        //act garante atualizações de estado e espera a render
        await act( async () => {
            render(<HistoricPage />);
        })  

        expect(getProductsMock).toHaveBeenCalledTimes(1); //verifica a chamada da API

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
        await waitFor(() => {
            expect(screen.queryByText("sulfite")).not.toBeInTheDocument(); 
        }, { timeout: 1000 })
        
    })

    it("should filter products by status", async () => {
        await act( async () => {
            render(<HistoricPage />);
        })

        const papel = screen.getByText(/papel sulfite a4 par\.\.\./i)
        const quadroBranco = screen.getByText(/qudro branco/i)
        expect(quadroBranco).toBeInTheDocument()


        const botaoAbrir = screen.getByRole('button', {
            name: /abrir filtro/i
        })

        fireEvent.click(botaoAbrir);
        
        const botaoFechar = screen.getByRole('button', {
            name: /fechar filtro/i
        })

        const radioPendente = screen.getByRole('radio', {
            name: /pendente/i
        })

        fireEvent.click(radioPendente)

        fireEvent.click(botaoFechar)

        expect(quadroBranco).not.toBeInTheDocument()
        expect(papel).toBeInTheDocument()
    })

    it("should filter products by category", async () => {
        await act( async () => {
            render(<HistoricPage />);
        })

        const quadroBranco = screen.getByText(/qudro branco/i)
        expect(quadroBranco).toBeInTheDocument()

        const papel = screen.getByText(/papel sulfite a4 par\.\.\./i)
        expect(papel).toBeInTheDocument()

        const botaoAbrir = screen.getByRole('button', {
            name: /abrir filtro/i
        })

        fireEvent.click(botaoAbrir);
        
        const botaoFechar = screen.getByRole('button', {
            name: /fechar filtro/i
        })

        const combobox = screen.getByRole('combobox', {
            name: /categoria/i
        })

        fireEvent.change(combobox, {  target: { value: "materiais-didaticos-pedagogicos" } })

        expect(combobox).toHaveValue("materiais-didaticos-pedagogicos")

        fireEvent.click(botaoFechar)

        expect(quadroBranco).toBeInTheDocument()
        expect(papel).not.toBeInTheDocument()
    })

    it("should filter products by date", async () => {
        await act( async () => {
            render(<HistoricPage />);
        })

        const canetaAzul = screen.getByText(/caneta teste azul pa\.\.\./i) //data - 10/12/2023
        
        expect(canetaAzul).toBeInTheDocument()

        const botaoAbrir = screen.getByRole('button', {
            name: /abrir filtro/i
        })

        fireEvent.click(botaoAbrir);

        const dataInicial = screen.getByLabelText(/data inicial:/i)
        const dataFinal = screen.getByLabelText(/data final:/i)

        const botaoFechar = screen.getByRole('button', {
            name: /fechar filtro/i
        })

        await act(async () => fireEvent.change(dataFinal, { target: { value: "2024-11-30"}}))
        await act(async () => fireEvent.change(dataInicial, { target: { value: "2022-11-30"}}))

        fireEvent.click(botaoFechar)

        const row = screen.getByRole('row', {
            name: /caneta teste azul caneta teste azul pa\.\.\. 99 01\/12\/2023 pendente abrir menu/i
        });

        expect(within(row).getByRole('cell', {
            name: /01\/12\/2023/i
        })).toBeInTheDocument();
    })

    it("should reset filters", async () => {
        await act( async () => {
            render(<HistoricPage />);
        })

        const papel = screen.getByText(/papel sulfite a4 par\.\.\./i)
        const quadroBranco = screen.getByText(/qudro branco/i)
        expect(quadroBranco).toBeInTheDocument()

        const botaoAbrir = screen.getByRole('button', {
            name: /abrir filtro/i
        })
        
        fireEvent.click(botaoAbrir);
        
        const botaoFechar = screen.getByRole('button', {
            name: /fechar filtro/i
        })

        const radioPendente = screen.getByRole('radio', {
            name: /pendente/i
        })

        fireEvent.click(radioPendente)

        expect(quadroBranco).not.toBeInTheDocument()
        expect(papel).toBeInTheDocument()

        const botaoResetar = screen.getByRole('button', {
            name: /resetar filtros/i
        })

        fireEvent.click(botaoResetar)
        fireEvent.click(botaoFechar)
        expect(screen.getByText(/qudro branco/i)).toBeInTheDocument()
    })

    it("should navigate through table pages", async () => {
        await act( async () => {
            render(<HistoricPage />);
        })

        const canetaAzul = screen.getByText(/caneta teste azul pa\.\.\./i)
        expect(canetaAzul).toBeInTheDocument();

        const botaoProximo = screen.getByRole('button', {
            name: /próximo/i
        })
        const botaoAnterior = screen.getByRole('button', {
            name: /anterior/i
        })
        
        fireEvent.click(botaoProximo)

        expect(canetaAzul).not.toBeInTheDocument()

        fireEvent.click(botaoAnterior)

        expect(screen.getByText(/caneta teste azul pa\.\.\./i)).toBeInTheDocument()
    })

    //#region linhas loading/isAuthenticated

    it("should redirect to / when user is not authenticated", () => {
        const pushMock = jest.fn();

        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });

        jest.spyOn(require("next/navigation"), "useRouter")
            .mockReturnValue({ push: pushMock });

        render(<HistoricPage />);

        expect(pushMock).toHaveBeenCalledWith("login");
    });

    it("should return null when loading", () => {
        
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            loading: true,
        });

        const { container } = render(<HistoricPage />);

        expect(container.firstChild).toBeNull();
    });

})