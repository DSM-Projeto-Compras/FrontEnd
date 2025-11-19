/* eslint-disable @typescript-eslint/no-require-imports */
const mockProducts = [
    {
        "id": "609c1f1f1b8c8b3a85f4d5f5",  // ID fictício
        "nome": 'Caneta Teste Azul',
        "tipo": 'material-de-consumo',
        "quantidade": 99,
        "categoria": 'material-de-escritorio',
        "descricao": 'Caneta teste azul para escritório',

        "cod_id": '6485073',
        "grupo": '75 - Artigos e Utensilios de Escritorios, Didaticos e Psicologicos',
        "classe": '7505 - Artigos para Escritorios',
        "material": '262773 - Caneta Esferografica',
        "elemento": '339030 - Material de Consumo',
        "natureza": '33903041<br>33903041<br>',

        "data": "2023-12-01T10:00:00.000Z",
        "status": "Pendente",
        "justificativa": '',
        "userId": "674b5c719cc34fc0cc69a6e1",
        "user": { "id": '674b5c719cc34fc0cc69a6e1', "nome": 'Fulano da Silva' }
    },
    {
        "id": 'cmi42wjvq000rvq4o4i16n3x8',
        "nome": 'DISPENSER PARA PAPEL TOALHA ACO INOXIDAVEL,(260X260X140)MM',
        "tipo": '339030 - Material de Consumo',
        "quantidade": 2,
        "categoria": 'material-de-limpeza',
        "descricao": 'Dispenser para papel toalha para os banheiros',
        "cod_id": '6529208',
        "grupo": '45 - Equipamentos de Instalacoes Hidraulicas, Sanitarias e de Calefacao',
        "classe": '4550 - Acessorios Ou Suprimentos para Instalacoes Hidraulicas, Sanitarias e de Calefacao',
        "material": '276421 - Dispenser para Papel Toalha',
        "elemento": '339030 - Material de Consumo',
        "natureza": '33903050<br>33903052<br>',
        "data": "2025-11-18T04:33:54.623Z",
        "status": 'Pendente',
        "justificativa": '',
        "userId": 'cmhme00jg0000vqawpz1q6c5j',
        "user": { "id": 'cmhme00jg0000vqawpz1q6c5j', "nome": 'Fulano de Souza' }
    },
    {
        "id": 'cmi425cuc000pvq4obhyottak',
        "nome": 'CARTOLINA',
        "tipo": '339030 - Material de Consumo',
        "quantidade": 1,
        "categoria": 'materiais-didaticos-pedagogicos',
        "descricao": 'cartolina',
        "cod_id": '6247520',
        "grupo": '93 - Materiais Manufaturados Nao Metalicos',
        "classe": '9310 - Papeis e Papeloes',
        "material": '23795 - Cartolinas',
        "elemento": '339030 - Material de Consumo',
        "natureza": '33903041<br>0<br>',
        "data": "2025-11-18T04:12:46.020Z",
        "status": 'Pendente',
        "justificativa": '',
        "userId": '674b5c719cc34fc0cc69a6e2',
        "user": { "id": '674b5c719cc34fc0cc69a6e2', "nome": 'Beltrano Almeida' }
  },
    {
        "id": "609c1f1f1b8c8b3a85f4d5f6",
        "nome": 'Papel sulfite',
        "tipo": 'material-de-consumo',
        "quantidade": 50,
        "categoria": 'material-de-escritorio',
        "descricao": 'Papel sulfite A4 para material escolar',

        "cod_id": '6363237',
        "grupo": '75 - Artigos e Utensilios de Escritorios, Didaticos e Psicologicos',
        "classe": '7520 - Materiais e Suprimentos Uso Didatico, Pedagogico, Psicologico, Papelaria, Pinceis e Acessorios para Pintura Manual',
        "material": '127817 - Papel Sulfite de Papelaria',
        "elemento": '339030 - Material de Consumo',
        "natureza": '33903040<br>0<br>',

        "data": "2023-12-01T10:00:00.000Z",
        "status": "Pendente",
        "justificativa": '',
        "userId": "674b5c719cc34fc0cc69a6e2",
        "user": { "id": '674b5c719cc34fc0cc69a6e2', "nome": 'Beltrano Almeida' }
    },

    {
        "id": "609c1f1f1b8c8b3a85f4d5f7",  
        "nome": 'Caneta Teste Preta',
        "tipo": 'material-de-consumo',
        "quantidade": 70,
        "categoria": 'material-de-escritorio',
        "descricao": 'Caneta teste preta para escritório',

        "cod_id": '6506623',
        "grupo": '75 - Artigos e Utensilios de Escritorios, Didaticos e Psicologicos',
        "classe": '7505 - Artigos para Escritorios',
        "material": '262773 - Caneta Esferografica',
        "elemento": '339030 - Material de Consumo',
        "natureza": '33903041<br>0<br>',

        "data": "2025-11-01T10:00:00.000Z",
        "status": "Negado",
        "justificativa": 'Quantidade muito alta para compra neste momento',
        "userId": "cmhme00jg0000vqawpz1q6c5j",
        "user": { "id": 'cmhme00jg0000vqawpz1q6c5j', "nome": 'Fulano de Souza' }
    },
    {
        "id": "609c1f1f1b8c8b3a85f4d5f8",  
        "nome": 'Quadro branco',
        "tipo": 'material-permanente',
        "quantidade": 2,
        "categoria": 'materiais-didaticos-pedagogicos',
        "descricao": 'Quadro branco para as salas superiores',

        "cod_id": '6506623',
        "grupo": '75 - Artigos e Utensilios de Escritorios, Didaticos e Psicologicos',
        "classe": '7505 - Artigos para Escritorios',
        "material": '262773 - Caneta Esferografica',
        "elemento": '339030 - Material de Consumo',
        "natureza": '33903041<br>0<br>',

        "data": "2025-11-02T10:00:00.000Z",
        "status": "Aprovado",
        "justificativa": '',
        "userId": "674b5c719cc34fc0cc69a6e1",
        "user": { "id": '674b5c719cc34fc0cc69a6e1', "nome": 'Fulano da Silva' }
    },

    {
        "id": 'cmi40x1fm000lvq4oe1ripjsh',
        "nome": 'BOLA',
        "tipo": '449052 - Equipamentos e Material Permanente',
        "quantidade": 2,
        "categoria": 'materiais-didaticos-pedagogicos',
        "descricao": 'bola',
        "cod_id": '6536298',
        "grupo": '64 - Equipamentos, Maquinas, Artigos de Uso Veterinario e Agropecuario',
        "classe": '6410 - Maquinas, Equipamentos e Mobiliarios de Uso Veterinario',
        "material": '289191 - Equipamentos de Adestramento e Manejo de Animais',
        "elemento": '449052 - Equipamentos e Material Permanente',
        "natureza": '44905234<br>0<br>',
        "data": "2025-11-18T03:38:18.370Z",
        "status": 'Pendente',
        "justificativa": '',
        "userId": "674b5c719cc34fc0cc69a6e1",
        "user": { "id": '674b5c719cc34fc0cc69a6e1', "nome": 'Fulano da Silva' }
    },
    {
        "id": 'cmi3qo6ui0001vqbwwra3inik',
        "nome": 'CAMERA DIGITAL PORTATIL,FOTOS ATE 10 MP, VíDEOS ATé 4K 120 FPS',
        "tipo": '449052 - Equipamentos e Material Permanente',
        "quantidade": 2,
        "categoria": '',
        "descricao": 'Camera fotografica para um projeto',
        "cod_id": '6530150',
        "grupo": '67 - Equipamentos Fotograficos, Filmograficos e Fonograficos',
        "classe": '6710 - Equipamentos Fotograficos',
        "material": '198285 - Camera Digital',
        "elemento": '449052 - Equipamentos e Material Permanente',
        "natureza": '44905234<br>0<br>',
        "data": "2025-11-17T22:51:29.322Z",
        "status": 'Aprovado',
        "justificativa": '',
        "userId": 'cmhme00jg0000vqawpz1q6c5j',
        "user": { "id": 'cmhme00jg0000vqawpz1q6c5j', "nome": 'Felipe Thiago' }
    }
]

import { render, screen, waitFor, fireEvent, act, within } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http } from "msw";
import { env } from "../../../config/env"
import '@testing-library/jest-dom'

import { useRouter } from "next/navigation";
import Header from "../../../app/components/organisms/Header";
import requisitionService from "../../../app/services/requisitionService";
import { useAuth } from "../../../app/contexts/AuthContext";
import AdminDashboardPage from "../../../app/pages/admin-dashboard/page";

jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("../../../app/contexts/AuthContext", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../../../app/services/requisitionService", () => ({
    getAllProducts: jest.fn().mockResolvedValue(mockProducts),
    updateProduct: jest.fn().mockResolvedValue({}),
    deleteProduct: jest.fn().mockResolvedValue({}),
    updateProductStatus: jest.fn().mockResolvedValue({})
}))



const server = setupServer(
    http.get(`${env.apiBaseUrl}/products`, () => {
            return Response.json({
                access_token: "access_token",
                cargo: "admin",
                products: mockProducts
            });
        }
    ),
)

//#region Header Component (admin)

describe("Header Component (admin)", () => {
    let mockPush: jest.Mock;
    let mockLogout: jest.Mock;

    beforeEach(() => {
        mockPush = jest.fn();
        mockLogout = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        (useAuth as jest.Mock).mockReturnValue({ 
            isAuthenticated: true, 
            user: { email: "admin@fatec.sp.gov.br", cargo: "admin"}, 
            login: jest.fn(), 
            logout: mockLogout })

        jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("should change page and display logos", async () => {
        render(<Header admin={true} />);

        screen.getByRole('img', {
            name: /logo fatec/i
        })
        screen.getByRole('img', {
            name: /logo cps/i
        })
        
        const abaHistorico = screen.getByText(/histórico/i)
        const abaAdmins = screen.getByText(/administradores/i)

        const menu = screen.getByText(/menu/i)
        if(menu){
            fireEvent.click(menu)
        }
        

        fireEvent.click(await abaHistorico);
        expect(mockPush).toHaveBeenCalledWith('admin-dashboard')
        
        fireEvent.click(await abaAdmins);
        expect(mockPush).toHaveBeenCalledWith('admin-users')
    })
})

//#region Admin products list

describe("Admin products list", () => {
    const getAllProductsMock = requisitionService.getAllProducts as jest.Mock;
    const updateProductStatusMock = requisitionService.updateProductStatus as jest.Mock;

    beforeAll(() => {
        server.listen();
    });
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ 
            isAuthenticated: true, 
            user: { email: "admin@fatec.sp.gov.br", cargo: "admin"}, 
            login: jest.fn(), 
            logout: jest.fn() 
        })
        getAllProductsMock.mockClear();
        updateProductStatusMock.mockClear();
        getAllProductsMock.mockResolvedValue(mockProducts);
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
            render(<AdminDashboardPage />);
        })  

        expect(getAllProductsMock).toHaveBeenCalledTimes(1)

        const caneta = screen.getByText("Caneta Teste Preta"); //produto negado
        const user = screen.getByRole('row', {
            name: /fulano de souza dispenser para papel\.\.\. dispenser para papel\.\.\. 2 18\/11\/2025 pendente abrir menu/i
        });

        const pendente = within(user).getByText(/pendente/i); //para valores repetidos isolar uma célula da tabela
        const aprovado = screen.getByText("Aprovado");
        const negado = screen.getByText("Negado");

        expect(caneta).toBeVisible()
        expect(pendente).toBeVisible()
        expect(aprovado).toBeVisible()
        expect(negado).toBeVisible()
    })

    //#region display error test
    it("should not render products on list and display error (console.error)", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const error = new Error("Erro simulado");
        (requisitionService.getAllProducts as jest.Mock).mockRejectedValueOnce(error);

        await act( async () => {
            render(<AdminDashboardPage />);
        })

        expect(requisitionService.getAllProducts).toHaveBeenCalledTimes(1); //foi chamado...

        expect(consoleErrorSpy).toHaveBeenCalledWith("Erro ao buscar produtos:", error) //...mas não retornou nada

        consoleErrorSpy.mockRestore();
    })

    it("should deny pendent item", async () => {
        await act( async () => {
            render(<AdminDashboardPage />);
        }) 

        expect(getAllProductsMock).toHaveBeenCalledTimes(1)

        const canetaAzul = screen.getByRole('row', {
            name: /fulano da silva caneta teste azul caneta teste azul pa\.\.\. 99 01\/12\/2023 pendente abrir menu/i
        });

        const menuOpcoes = within(canetaAzul).getByText(/abrir menu/i);

        await act(async () => {
            fireEvent.click(menuOpcoes)
        })

        const botaoNegar = screen.getByRole('link', {
            name: /negar/i
        })

        await act(async () => fireEvent.click(botaoNegar))

        const textoNegar = screen.getByText(/tem certeza que deseja negar este produto\?/i)
        expect(textoNegar).toBeInTheDocument()

        const textBox = screen.getByRole('textbox', {  name: /justificativa \(opcional\):/i})
        fireEvent.change(textBox, { target: { value: "produto negado "}})

        const botaoConfirmar = screen.getByRole('button', {  name: /confirmar/i})
        await act(async () => fireEvent.click(botaoConfirmar))

        expect(updateProductStatusMock).toHaveBeenCalledTimes(1)

        await waitFor(() => {
            expect(screen.queryByText(/negar produto/i)).not.toBeInTheDocument();
        });

        const row = screen.getByRole('row', {
            name: /fulano da silva caneta teste azul caneta teste azul pa\.\.\. 99 01\/12\/2023 negado abrir menu/i
        });

        expect(within(row).getByText(/negado/i)).toBeInTheDocument();
    })

    it("should approve pendent item", async () => {
        await act( async () => {
            render(<AdminDashboardPage />);
        }) 

        expect(getAllProductsMock).toHaveBeenCalledTimes(1)

        const canetaAzul = screen.getByRole('row', {
            name: /fulano da silva caneta teste azul caneta teste azul pa\.\.\. 99 01\/12\/2023 pendente abrir menu/i
        });

        const menuOpcoes = within(canetaAzul).getByText(/abrir menu/i);

        await act(async () => {
            fireEvent.click(menuOpcoes)
        })
        
        const botaoAprovar = screen.getByText(/aprovar/i)

        await act(async() => {
            fireEvent.click(botaoAprovar)
        })

        const canetaAprovada = screen.getByRole('row', {
            name: /fulano da silva caneta teste azul caneta teste azul pa\.\.\. 99 01\/12\/2023 aprovado abrir menu/i
        });

        expect(within(canetaAprovada).getByText(/aprovado/i)).toBeInTheDocument();
    })

    it("should open details modal on pendent item", async () => {
        await act( async() => {
            render(<AdminDashboardPage />)
        })

        const canetaAzul = screen.getByRole('row', {
            name: /fulano da silva caneta teste azul caneta teste azul pa\.\.\. 99 01\/12\/2023 pendente abrir menu/i
        });

        const menuOpcoes = within(canetaAzul).getByText(/abrir menu/i);

        act(() => fireEvent.click(menuOpcoes))

        
        const opcaoDetalhes = screen.getByText(/ver detalhes/i)

        act(() => fireEvent.click(opcaoDetalhes))

        const tituloDetalhes = screen.getByText("Detalhes do Produto")

        expect(tituloDetalhes).toBeInTheDocument();

        const botaoFechar = screen.getByRole('button', { name: /fechar/i });
        act(() => fireEvent.click(botaoFechar));

        await waitFor(() => {
            expect(screen.queryByText("Detalhes do Produto")).not.toBeInTheDocument();
        });
    })

    it("should open justification modal on denied item", async () => {
        await act(async() => {
            render(<AdminDashboardPage />)
        })

        const rowCanetaPreta = screen.getByRole('row', {
            name: /fulano de souza caneta teste preta caneta teste preta p\.\.\. 70 01\/11\/2025 negado abrir menu/i
        });

        const opcoesCanetaPreta =within(rowCanetaPreta).getByText(/abrir menu/i);

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

    it("should handle error when denying item (console.error)", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const error = new Error("Erro simulado");
        (requisitionService.updateProductStatus as jest.Mock).mockRejectedValueOnce(error);

        await act(async () => {
            render(<AdminDashboardPage />)
        })

        const canetaAzul = screen.getByRole('row', {
            name: /fulano da silva caneta teste azul caneta teste azul pa\.\.\. 99 01\/12\/2023 pendente abrir menu/i
        });

        const menuOpcoes = within(canetaAzul).getByText(/abrir menu/i);

        await act(async () => {
            fireEvent.click(menuOpcoes)
        })

        const botaoNegar = screen.getByRole('link', {
            name: /negar/i
        })

        await act(async () => fireEvent.click(botaoNegar))

        const botaoConfirmar = screen.getByRole('button', {  name: /confirmar/i})
        await act(async () => fireEvent.click(botaoConfirmar))

        expect(requisitionService.updateProductStatus).toHaveBeenCalledTimes(1);

        expect(consoleErrorSpy).toHaveBeenCalledWith("Erro ao negar produto:", error)

        consoleErrorSpy.mockRestore();
    })

    it("should handle error when approving item (console.error)", async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const error = new Error("Erro simulado");
        (requisitionService.updateProductStatus as jest.Mock).mockRejectedValueOnce(error);

        await act(async () => {
            render(<AdminDashboardPage />)
        })

        const canetaAzul = screen.getByRole('row', {
            name: /fulano da silva caneta teste azul caneta teste azul pa\.\.\. 99 01\/12\/2023 pendente abrir menu/i
        });

        const menuOpcoes = within(canetaAzul).getByText(/abrir menu/i);

        await act(async () => {
            fireEvent.click(menuOpcoes)
        })

        const botaoAprovar = screen.getByText(/aprovar/i)

        await act(async() => {
            fireEvent.click(botaoAprovar)
        })

        expect(requisitionService.updateProductStatus).toHaveBeenCalledTimes(1);

        expect(consoleErrorSpy).toHaveBeenCalledWith("Erro ao aprovar produto:", error)

        consoleErrorSpy.mockRestore();
    })
})



//#region Products Filter (admin)

describe("Products Filter", () => { //Testes repetidos, se possível, unir componentes em um só e apenas realizar chamada no front
    const getAllProductsMock = requisitionService.getAllProducts as jest.Mock;

    beforeAll(() => {
        //Antes do teste, resgata o mock definido como acima
        server.listen();
    });
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ 
            isAuthenticated: true, 
            user: { email: "admin@fatec.sp.gov.br", cargo: "admin"}, 
            login: jest.fn(), 
            logout: jest.fn() 
        })
        getAllProductsMock.mockClear();
        getAllProductsMock.mockResolvedValue(mockProducts);
    })
    afterAll(() => { 
        server.close()
    });
    afterEach(() => {
        server.resetHandlers();
        jest.clearAllMocks();
    })

    it("should render product list without filter", async () => {
        await act( async () => {
            render(<AdminDashboardPage />);
        })  

        expect(getAllProductsMock).toHaveBeenCalledTimes(1); //verifica a chamada da API

        const caneta = screen.getByText("Caneta Teste Azul");
        const papel = screen.getByText(/papel sulfite a4 par\.\.\./i)

        await waitFor(() => {
            expect(caneta).toBeInTheDocument()
            expect(papel).toBeInTheDocument()
        })

        expect(screen.getByText("Lista de Produtos Solicitados")).toBeInTheDocument()
    })

    it("should open filter button", async () => {
        await act( async () => {
            render(<AdminDashboardPage />);
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
            render(<AdminDashboardPage />);
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
            render(<AdminDashboardPage />);
        })

        const papel = screen.getByText(/papel sulfite a4 par\.\.\./i)
        const quadroBranco = screen.getByRole('cell', {
            name: /02\/11\/2025/i
        })
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
            render(<AdminDashboardPage />);
        })

        const quadroBranco = screen.getByRole('cell', {
            name: /02\/11\/2025/i
        })
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

    // it("should filter products by date", )

    it("should reset filters", async () => {
        await act( async () => {
            render(<AdminDashboardPage />);
        })

        const papel = screen.getByText(/papel sulfite a4 par\.\.\./i)
        const quadroBranco = screen.getByRole('cell', {
            name: /02\/11\/2025/i
        })
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
        expect(screen.getByRole('cell', {
            name: /02\/11\/2025/i
        })).toBeInTheDocument()
    })

    it("should navigate through table pages", async () => {
        await act( async () => {
            render(<AdminDashboardPage />);
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

})