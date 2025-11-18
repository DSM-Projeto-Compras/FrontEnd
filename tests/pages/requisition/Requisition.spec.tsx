//mocks

jest.mock('next/router', ()=> ({push: jest.fn()}))
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("../../../app/contexts/AuthContext", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../../../app/services/requisitionService", () => ({
    sendRequisition: jest.fn().mockResolvedValue({}),
}))

//imports
import { http } from "msw"
import { env } from "../../../config/env"
import '@testing-library/jest-dom'
import Router from 'next/router'
import { setupServer } from "msw/node";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import mockRouter from "next-router-mock";
import RequisitionPage from "../../../app/pages/requisition/page";

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

describe.skip("Requisition Page", () => {
    beforeAll(() => server.listen())

    afterAll(() => server.close())

    afterEach(() => server.resetHandlers())

    it("should render requisition page", () => {
        render(<RequisitionPage />)
    })

    // TODO testes na pesquisa BEC, formulário, envio de requisições, erros, validadores
})