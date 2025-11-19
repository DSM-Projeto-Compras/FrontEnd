/* eslint-disable @typescript-eslint/no-require-imports */
//mocks

jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.useFakeTimers();

jest.mock("../../../app/contexts/AuthContext", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../../../app/services/requisitionService", () => ({
    sendRequisition: jest.fn().mockResolvedValue({}),
}))

jest.mock("../../../app/services/searchBecService", () => ({
    getProducts: jest.fn(),
    searchProduct: jest.fn(),
    getProductDetails: jest.fn(),
}));





//imports
import { http } from "msw"
import { env } from "../../../config/env"
import '@testing-library/jest-dom'
import Router from 'next/router'
import { setupServer } from "msw/node";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import mockRouter from "next-router-mock";
import RequisitionPage from "../../../app/pages/requisition/page";
import { useAuth } from "../../../app/contexts/AuthContext";
import SearchBecService from "../../../app/services/searchBecService";

interface RequisitionData {
  nome: string;
  tipo: string;
  quantidade: number;
  categoria: string;
  descricao?: string;
  cod_id?: string;
  grupo?: string;
  classe?: string;
  material?: string;
  elemento?: string;
  natureza?: string;
}

const handleRequestProduct = async ({ request }: { request: Request}) => {
    const body = await request.json() as RequisitionData;
    const { nome } = body;

    //erro de servidor
    if(nome === "produtoErrado") {
        return Response.json({
            message: "Erro ao enviar a requisição:"
        }, {status: 400})
    }

    //requisição bem-sucedida
    return Response.json({
        message: "Requisição enviada com sucesso"
    }, {status: 201})
    
}

//setupServer
const server = setupServer(
    http.post(`${env.apiBaseUrl}/products`, handleRequestProduct)
)

describe("Requisition Page", () => {
    beforeAll(() => server.listen())

    beforeEach(() => {
        (SearchBecService.getProducts as jest.Mock).mockResolvedValue({
            d: ["Caneta Azul", "Caneta Preta", "Caneta Vermelha"],
        });

        // Mock da busca de código BEC
        (SearchBecService.searchProduct as jest.Mock).mockResolvedValue(`
            <div id="ContentPlaceHolder1_gvResultadoPesquisa_lbTituloItem_0">
                ABC123 Produto Teste
            </div>
        `);

        // Mock dos detalhes do produto BEC
        (SearchBecService.getProductDetails as jest.Mock).mockResolvedValue(`
            <span id="ContentPlaceHolder1_lbGrupoInfo">Grupo Teste</span>
            <span id="ContentPlaceHolder1_lbClasseInfo">Classe Teste</span>
            <span id="ContentPlaceHolder1_lbMaterialInfo">Material Teste</span>
            <span id="ContentPlaceHolder1_lbNElementoDespesaInfo">Elemento 123</span>
            <span id="ContentPlaceHolder1_lbNdInfo">Natureza Teste</span>
        `);

        (useAuth as jest.Mock).mockReturnValue({ //autenticar usuário na tela
            isAuthenticated: true, 
            user: { email: "admin2@fatec.sp.gov.br", cargo: "user"}, 
            login: jest.fn(), 
            logout: jest.fn() 
        })
    })

    afterAll(() => server.close())

    afterEach(() => {
        server.resetHandlers();
        (Router.push as jest.Mock).mockClear();
        jest.clearAllMocks();
    })

    it("should render requisition page", async () => {
        await act(() => {render(<RequisitionPage />)})

        const titulo = screen.getByText("Faça a Requisição do Produto Desejado")

        const inputProduto = screen.getByRole('textbox', {name: /nome do produto\* \(selecione uma sugestão\)/i})
        const inputQtd = screen.getByRole('spinbutton', {name: /quantidade\*/i})
        const comboCategoria = screen.getByRole('combobox', {name: /categoria\*/i})
        const inputDescricao = screen.getByRole('textbox', {name: /descrição/i})
        const btnEnviar = screen.getByRole('button', {name: /enviar/i})

        expect(titulo).toBeInTheDocument()
        expect(inputProduto).toBeInTheDocument()
        expect(inputQtd).toBeInTheDocument()
        expect(comboCategoria).toBeInTheDocument()
        expect(inputDescricao).toBeInTheDocument()
        expect(btnEnviar).toBeInTheDocument()

        
    })

    it("should show product suggestions when typing", async () => {
        // mock da resposta do getProducts
        (SearchBecService.getProducts as jest.Mock).mockResolvedValue({
            d: ["Caneta Azul", "Caneta Preta", "Caneta Vermelha"],
        });

        render(<RequisitionPage />);

        const input = screen.getByRole("textbox", {
            name: /nome do produto/i,
        });

        // digita "caneta"
        await act(async () => {
            fireEvent.change(input, { target: { value: "caneta" } });
            jest.advanceTimersByTime(1000); // simula o debounce
        });

        // espera aparecer as sugestões
        const sugestao1 = await screen.findByText("Caneta Azul");
        const sugestao2 = screen.getByText("Caneta Preta");

        expect(sugestao1).toBeInTheDocument();
        expect(sugestao2).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(sugestao1)
        })

        const infoProduto = screen.getByText(/informações do produto/i)
        expect(infoProduto).toBeInTheDocument()
    });

    it("should request product", async () => {
        (SearchBecService.getProducts as jest.Mock).mockResolvedValue({
            d: ["Caneta Azul", "Caneta Preta", "Caneta Vermelha"],
        });

        render(<RequisitionPage />);

        const input = screen.getByRole("textbox", {
            name: /nome do produto/i,
        });
        const inputQtd = screen.getByRole('spinbutton', {name: /quantidade\*/i})
        const comboCategoria = screen.getByRole('combobox', {name: /categoria\*/i})
        const inputDescricao = screen.getByRole('textbox', {name: /descrição/i})
        const btnEnviar = screen.getByRole('button', {name: /enviar/i})

        await act(async () => {
            fireEvent.change(input, { target: { value: "caneta" } });
            jest.advanceTimersByTime(1000);
        });

        // espera aparecer as sugestões
        const sugestao = await screen.findByText("Caneta Azul");
        await act(async () => {
            fireEvent.click(sugestao)
        })

        fireEvent.change(inputQtd, { target: { value: 5 }})

        await act(async () => {
            fireEvent.change(comboCategoria, { target: { value: "material-de-escritorio"}})
        })

        fireEvent.change(inputDescricao, { target: { value: "Canetas azuis para prova"}})

        await act(async() => fireEvent.click(btnEnviar))

        await(act(async() => expect(screen.getByText(/produto solicitado com sucesso!/i)).toBeInTheDocument()))
    })

    it("should display validators on empty inputs", async () => {
        await act(() => {render(<RequisitionPage />)})

        const btnEnviar = screen.getByRole('button', {name: /enviar/i})

        await act(async() => fireEvent.click(btnEnviar))

        const nome = screen.getByText(/nome é obrigatório/i)
        const quantidade = screen.getByText(/quantidade é obrigatória/i)
        const categoria = screen.getByText(/categoria é obrigatória/i)

        expect(nome).toBeInTheDocument()
        expect(quantidade).toBeInTheDocument()
        expect(categoria).toBeInTheDocument()

        
    })
    
    it("should display product sugestion error", async() => {
        render(<RequisitionPage />)

        const input = screen.getByRole("textbox", {
            name: /nome do produto/i,
        });
        const inputQtd = screen.getByRole('spinbutton', {name: /quantidade\*/i})
        const comboCategoria = screen.getByRole('combobox', {name: /categoria\*/i})
        const inputDescricao = screen.getByRole('textbox', {name: /descrição/i})
        const btnEnviar = screen.getByRole('button', {name: /enviar/i})

        await act(async () => {
            fireEvent.change(input, { target: { value: "caneta" } });
            jest.advanceTimersByTime(1000);
        });

        fireEvent.change(inputQtd, { target: { value: 5 }})

        await act(async () => {
            fireEvent.change(comboCategoria, { target: { value: "material-de-escritorio"}})
        })

        fireEvent.change(inputDescricao, { target: { value: "Canetas azuis para prova"}})

        await act(async() => fireEvent.click(btnEnviar))

        const mensagem = screen.getByText(/por favor, selecione uma sugestão de produto\./i)

        expect(mensagem).toBeInTheDocument()
    })

    it("should redirect to / when user is not authenticated", () => {
        const pushMock = jest.fn();

        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        jest.spyOn(require("next/navigation"), "useRouter")
            .mockReturnValue({ push: pushMock });

        render(<RequisitionPage />);

        expect(pushMock).toHaveBeenCalledWith("login");
    });
    

    //#region linhas loading/isAuthenticated

    it("should redirect to / when user is not authenticated", () => {
        const pushMock = jest.fn();

        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            loading: false,
        });

        jest.spyOn(require("next/navigation"), "useRouter")
            .mockReturnValue({ push: pushMock });

        render(<RequisitionPage />);

        expect(pushMock).toHaveBeenCalledWith("login");
    });

    it("should return null when loading", () => {
        
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            loading: true,
        });

        const { container } = render(<RequisitionPage />);

        expect(container.firstChild).toBeNull();
    });
})