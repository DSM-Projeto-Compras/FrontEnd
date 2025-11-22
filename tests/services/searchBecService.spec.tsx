import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import SearchBecService from "../../app/services/searchBecService";

const BASE_URL = "https://www.bec.sp.gov.br/BEC_Catalogo_ui";

const server = setupServer(
  // mock da rota do autocomplete
  http.post(`${BASE_URL}/WebService/AutoComplete.asmx/GetItensList`, async ({ request }) => {
    return HttpResponse.json({ d: ["Caneta Azul", "Caneta Preta"] });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SearchBecService.getProducts", () => {
  it("should return autocomplete suggestions", async () => {
    const response = await SearchBecService.getProducts("caneta");

    expect(response.d).toEqual(["Caneta Azul", "Caneta Preta"]);
  });

  it("should return empty list when the API fails", async () => {

    server.use(
        http.post(`${BASE_URL}/WebService/AutoComplete.asmx/GetItensList`, () => {
            return new HttpResponse(null, { status: 500 });
        })
    );

    const response = await SearchBecService.getProducts("erro");
    expect(response.d).toEqual([]);
  });
});

describe("SearchBecService.searchProduct", () => {
  beforeEach(() => {
    server.use(
      http.get(`${BASE_URL}/CatalogoPesquisa3.aspx`, async () => {
        return HttpResponse.text("<html><body>Produto X</body></html>");
      })
    );
  });

  it("should return HTML string", async () => {
    const html = await SearchBecService.searchProduct("caneta");
    expect(html).toContain("Produto X");
  });

  it("should return empty string on error", async () => {
    server.use(
      http.get(`${BASE_URL}/CatalogoPesquisa3.aspx`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const html = await SearchBecService.searchProduct("caneta");
    expect(html).toBe("");
  });
});

describe("SearchBecService.getProductDetails", () => {
  beforeEach(() => {
    server.use(
      http.get(`${BASE_URL}/CatalogDetalheNovo.aspx`, async () => {
        return HttpResponse.text("<html><body>DETALHE XYZ</body></html>");
      })
    );
  });

  it("should return detail HTML", async () => {
    const html = await SearchBecService.getProductDetails("12345");
    expect(html).toContain("DETALHE XYZ");
  });

  it("should return empty string on error", async () => {
    server.use(
      http.get(`${BASE_URL}/CatalogDetalheNovo.aspx`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const html = await SearchBecService.getProductDetails("12345");
    expect(html).toBe("");
  });
});
