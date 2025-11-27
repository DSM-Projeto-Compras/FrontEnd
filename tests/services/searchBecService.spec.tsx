import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import SearchBecService from "../../app/services/searchBecService";
import { env } from "../../config/env";

const API_BASE = env.apiBaseUrl;

const server = setupServer(
  // mock da rota proxy do backend para autocomplete
  http.post(`${API_BASE}/bec/products`, async ({ request }) => {
    const body = await request.json() as { prefixText: string; count: number };
    if (body.prefixText === "erro") {
      return new HttpResponse(null, { status: 500 });
    }
    return HttpResponse.json({
      success: true,
      count: 2,
      data: ["Caneta Azul", "Caneta Preta"],
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SearchBecService.getProducts (proxy to /bec/products)", () => {
  it("should return autocomplete suggestions from backend proxy", async () => {
    const response = await SearchBecService.getProducts("caneta");

    expect(response.d).toEqual(["Caneta Azul", "Caneta Preta"]);
  });

  it("should return empty list when the backend proxy fails", async () => {
    const response = await SearchBecService.getProducts("erro");
    expect(response.d).toEqual([]);
  });
});

describe("SearchBecService.searchAndGetDetails (proxy to /bec/search-details)", () => {
  beforeEach(() => {
    server.use(
      http.post(`${API_BASE}/bec/search-details`, async ({ request }) => {
        const body = await request.json() as { description: string };
        if (body.description === "erro") {
          return new HttpResponse(null, { status: 500 });
        }
        return HttpResponse.json({
          success: true,
          productId: "ABC123",
          description: body.description,
          details: {
            cod_id: "ABC123",
            grupo: "Grupo Teste",
            classe: "Classe Teste",
            material: "Material Teste",
            elemento: "Elemento 123",
            natureza: "Natureza Teste",
          },
        });
      })
    );
  });

  it("should return structured product details from backend proxy", async () => {
    const details = await SearchBecService.searchAndGetDetails("caneta");
    expect(details).toEqual({
      cod_id: "ABC123",
      grupo: "Grupo Teste",
      classe: "Classe Teste",
      material: "Material Teste",
      elemento: "Elemento 123",
      natureza: "Natureza Teste",
    });
  });

  it("should return null on error", async () => {
    const details = await SearchBecService.searchAndGetDetails("erro");
    expect(details).toBeNull();
  });
});

describe("SearchBecService.getProductDetails (proxy to /bec/product/:cod_id)", () => {
  beforeEach(() => {
    server.use(
      http.get(`${API_BASE}/bec/product/:cod_id`, async () => {
        return HttpResponse.json({
          success: true,
          data: {
            cod_id: "12345",
            grupo: "Grupo XYZ",
            classe: "Classe XYZ",
            material: "Material XYZ",
            elemento: "Elemento XYZ",
            natureza: "Natureza XYZ",
          },
        });
      })
    );
  });

  it("should return product details from backend proxy", async () => {
    const details = await SearchBecService.getProductDetails("12345");
    expect(details).toEqual({
      cod_id: "12345",
      grupo: "Grupo XYZ",
      classe: "Classe XYZ",
      material: "Material XYZ",
      elemento: "Elemento XYZ",
      natureza: "Natureza XYZ",
    });
  });

  it("should return null on error", async () => {
    server.use(
      http.get(`${API_BASE}/bec/product/:cod_id`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const details = await SearchBecService.getProductDetails("12345");
    expect(details).toBeNull();
  });
});
