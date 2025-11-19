/* eslint-disable @typescript-eslint/no-require-imports */
const mockAdmins = [
    {
        id: "cmhw8naao0000vqc86rda0ttd", 
        nome: "Administrador", 
        email: "admin@fatec.sp.gov.br",
        cargo: "admin",
        dataCriacao: "2025-11-12T16:52:30.807Z",
        codigoEmail: null,
        codigoExp: null
    },
    {
        id: "cmhpqqk730000lrfgvwxcqir7", 
        nome: "Administrador Dois", 
        email: "admin2@fatec.sp.gov.br",
        cargo: "admin",
        dataCriacao: "2025-11-08T03:44:33.471Z",
        codigoEmail: null,
        codigoExp: null
    },
    {
        id: "cmhpqqk730000lrfgvwxcqir8", 
        nome: "Administrador Tres", 
        email: "admin3@fatec.sp.gov.br",
        cargo: "admin",
        dataCriacao: "2025-12-12T03:44:33.471Z",
        codigoEmail: null,
        codigoExp: null
    },
]

const mockMe = {
    id: "cmhw8naao0000vqc86rda0ttd", 
    nome: "Administrador", 
    email: "admin@fatec.sp.gov.br",
    cargo: "admin",
    dataCriacao: "2025-11-12T16:52:30.807Z",
    codigoEmail: null,
    codigoExp: null
}

import '@testing-library/jest-dom'
import { setupServer } from "msw/node";
import { env } from "../../../config/env"
import { http } from "msw";
import requisitionService from "../../../app/services/requisitionService";
import { useAuth } from "../../../app/contexts/AuthContext";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import AdminUsersPage from "../../../app/pages/admin-users/page";
import AdminUsersTemplate from '../../../app/components/templates/admin-users/AdminUsersTemplate';
import mockRouter from "next-router-mock";
import adminService from '../../../app/services/adminService';



jest.mock('next/router', ()=> ({push: jest.fn()}))
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock("next/navigation", () => require("next-router-mock"));

jest.mock("../../../app/contexts/AuthContext", () => ({
    useAuth: jest.fn().mockReturnValue(mockMe),
}));

jest.mock("../../../app/services/adminService", () => {
    const actualAdminService = jest.requireActual("../../../app/services/adminService").default
    return{
        __esModule: true,
        default: {
            login: jest.fn(),
            register: jest.fn(),
            changePassword: jest.fn(),
            deleteUser: actualAdminService.deleteUser,
        },
    }   
    
})

jest.mock("../../../app/services/requisitionService", () => ({
    getAdmins: jest.fn().mockResolvedValue(mockAdmins.map(admin => ({
        _id: admin.id,
        ...admin
    }))),
    deleteUser: jest.fn().mockResolvedValue({}),
}))

const server = setupServer(
    http.get(`${env.apiBaseUrl}/logins`, () => {
            return Response.json({
                access_token: "access_token",
                cargo: "admin",
                admins: mockAdmins
            });
        }
    ),
    http.delete(`${env.apiBaseUrl}/logins/usuario/:id`, async ({ params }) => {
        const id = params.id as string;

        if(id === mockMe.id) {
            return new Response(JSON.stringify({ message: "Você não pode deletar sua própria conta"}), {
                status: 403,
                headers: {'Content-Type': 'application/json'}
            })
        }

        return new Response(JSON.stringify({message: "Usuário deletado com sucesso!" }), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        })
    })
)

//#region Registered admins list

describe("Registered admins list", () => {
    const getAdminsMock = requisitionService.getAdmins as jest.Mock
    const deleteUserSpy = jest.spyOn(adminService, 'deleteUser');
    
    const mockOnDelete = jest.fn((id: string) => {
        adminService.deleteUser(id).then(() => {
            getAdminsMock();
        }).catch(error => {
            console.error('Erro de deleção simulado no Page Component:', error);
        })
    })

    beforeAll(() => server.listen());

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true, 
            user: { 
                id: mockAdmins[0].id,
                email: mockAdmins[0].email,
                cargo: mockAdmins[0].cargo,
                nome: mockAdmins[0].nome
            }, 
            login: jest.fn(), 
            logout: jest.fn()
        })

        getAdminsMock.mockClear();
        deleteUserSpy.mockClear();
        mockOnDelete.mockClear();

        getAdminsMock.mockResolvedValue(mockAdmins.map(admin => ({ _id: admin.id, ...admin})));
    })

    afterAll(() => server.close())

    afterEach(() => {
        server.resetHandlers();
        // (Router.push as jest.Mock).mockClear();
        act(() => {mockRouter.setCurrentUrl("/")})
        jest.clearAllMocks();
    })

    it("should display registered admins list", async () => {
        await act( async () => {
            render(<AdminUsersTemplate onDelete={mockOnDelete}/>)
        })

        expect(getAdminsMock).toHaveBeenCalledTimes(1);

        const emailAdmin = screen.getByRole('cell', {
            name: /admin@fatec\.sp\.gov\.br/i
        })

        const mudarSenha = screen.getByRole('button', {
            name: /trocar minha senha/i
        })

        const deletarUsuario = screen.getByRole('row', {
            name: /administrador dois admin2@fatec\.sp\.gov\.br/i
        });

        const botaoDeletar = within(deletarUsuario).getByRole('button', {
            name: /deletar usuário/i
        });

        expect(emailAdmin).toBeInTheDocument()
        expect(mudarSenha).toBeInTheDocument()
        expect(botaoDeletar).toBeInTheDocument()

    })

    it("should navigate to /admin-password when clicking changing password option", async () => {
        await act(async () => {
            render(<AdminUsersPage />)
        })

        const mudarSenha = screen.getByRole('button', {
            name: /trocar minha senha/i
        })

        fireEvent.click(mudarSenha)

        await waitFor(() => expect(mockRouter.asPath).toEqual("/admin-password"), {timeout: 5000, interval: 100})
    })

    it("should navigate to /admin-register when clicking register button", async () => {
        await act(async () => {
            render(<AdminUsersPage />)
        })

        const botao = screen.getByRole('button', {  name: /adicionar administrador/i})

        fireEvent.click(botao)

        await waitFor(() => expect(mockRouter.asPath).toEqual("/admin-register"), {timeout: 5000, interval: 100})
    })


    it("should delete newers admins", async () => {
        // await act(async () => {
        //     render(<AdminUsersTemplate onDelete={mockOnDelete} />);
        // })

        // const targetAdminId = mockAdmins[1].id; 

        // const deletarAdmin = screen.getByRole('row', {
        //     name: /administrador dois admin2@fatec\.sp\.gov\.br/i
        // });

        // const botaoDeletar = within(deletarAdmin).getByRole('button', {
        //     name: /deletar usuário/i
        // });

        // await act(async() => {
        //     fireEvent.click(botaoDeletar)
        // })

        // expect(mockOnDelete).toHaveBeenCalledWith(targetAdminId);

        // await waitFor(() => {
        //     expect(deleteUserMock).toHaveBeenCalledWith(targetAdminId);
        // });

        // await waitFor(() => {
        //     expect(getAdminsMock).toHaveBeenCalledTimes(2);
        // });

        // screen.debug();
        // screen.logTestingPlaygroundURL()

        await act(async () => {
            render(<AdminUsersTemplate onDelete={mockOnDelete} />);
        })

        // O admin a ser deletado é o Administrador Dois (id: cmhpqqk730000lrfgvwxcqir7)
        const targetAdminId = mockAdmins[1].id; 
        
        
        const deletarAdminRow = screen.getByRole('row', {
            name: /administrador dois admin2@fatec\.sp\.gov\.br/i
        });

        const botaoDeletar = within(deletarAdminRow).getByRole('button', {
            name: /deletar usuário/i
        });

        await act(async () => {
            fireEvent.click(botaoDeletar)
        })

        expect(mockOnDelete).toHaveBeenCalledWith(targetAdminId); 
        
        await waitFor(() => {
            expect(deleteUserSpy).toHaveBeenCalledWith(targetAdminId);
        });

        await waitFor(() => {
            expect(getAdminsMock).toHaveBeenCalledTimes(2);
        });
        
        // screen.debug();
        // screen.logTestingPlaygroundURL()
    })

    it("should prevent deletion of the logged-in user", async () => {
        await act(async () => {
            render(<AdminUsersTemplate onDelete={mockOnDelete} />);
        })

        const loggedInAdminId = mockMe.id; 
        
        const deletarAdminRow = screen.getByRole('row', {
            name: /administrador admin@fatec\.sp\.gov\.br/i
        });

        const botaoDeletar = within(deletarAdminRow).getByRole('button', {
            name: /deletar usuário/i
        });

        await act(async () => {
            fireEvent.click(botaoDeletar)
        })

        expect(mockOnDelete).toHaveBeenCalledWith(loggedInAdminId); 
        
        await waitFor(() => {
            expect(deleteUserSpy).toHaveBeenCalledWith(loggedInAdminId);
        });

        await waitFor(() => {
            expect(getAdminsMock).toHaveBeenCalledTimes(1);
        });
    })
})