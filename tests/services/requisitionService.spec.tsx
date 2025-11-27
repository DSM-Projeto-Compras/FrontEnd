import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import requisitionService from "../../app/services/requisitionService";

// Corrige os envs (tinha erro de nome)
const BASE_URL = process.env.NEXT_PUBLIC_API_BASEURL + "/products";
const USERS_URL = process.env.NEXT_PUBLIC_API_BASEURL + "/logins";

// Mock do localStorage
beforeAll(() => {
  Object.defineProperty(global, "localStorage", {
    value: {
      getItem: jest.fn(() => "fake-token"),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
  });
});

// Handlers MSW
const server = setupServer(
  // GET /products
  http.get(`${BASE_URL}`, () => {
    return HttpResponse.json([
      { id: "1", nome: "Produto A", quantidade: 10 },
      { id: "2", nome: "Produto B", quantidade: 5 },
    ]);
  }),

  // GET /products/all
  http.get(`${BASE_URL}/all`, () => {
    return HttpResponse.json([
      { id: "1", nome: "Produto A", user: { id: "0", nome: "Admin" } },
    ]);
  }),

  // POST /products
  http.post(`${BASE_URL}`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, data: body });
  }),

  // PUT /products
  http.put(`${BASE_URL}/`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ updated: true, data: body });
  }),

  // PUT /products/aprove/:id
  http.put(`${BASE_URL}/aprove/:id`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      approved: true,
      id: params.id,
      data: body,
    });
  }),

  // DELETE /products/:id
  http.delete(`${BASE_URL}/:id`, () => {
    return HttpResponse.json({ deleted: true });
  }),

  // GET /logins
  http.get(`${USERS_URL}`, () => {
    return HttpResponse.json([
      {
        _id: "aaa",
        nome: "Admin",
        email: "admin@fatec.sp.gov.br",
        admin: true,
      },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

//
// TESTES
//

describe.skip("RequisitionService.getProducts", () => {
  it("should return product list", async () => {
    const data = await requisitionService.getProducts();
    expect(data.length).toBe(2);
    expect(data[0].nome).toBe("Produto A");
  });

  it("should throw on API error", async () => {
    server.use(http.get(`${BASE_URL}`, () => HttpResponse.error()));

    await expect(requisitionService.getProducts()).rejects.toThrow();
  });
});

describe.skip("RequisitionService.getAllProducts", () => {
  it("should return admin list", async () => {
    const data = await requisitionService.getAllProducts();
    expect(data[0].user.nome).toBe("Admin");
  });

  it("should throw on API error", async () => {
    server.use(http.get(`${BASE_URL}/all`, () => HttpResponse.error()));

    await expect(requisitionService.getAllProducts()).rejects.toThrow();
  });
});

describe.skip("RequisitionService.sendRequisition", () => {
  it("should send a requisition successfully", async () => {
    await expect(
      requisitionService.sendRequisition({
        nome: "Produto",
        tipo: "Material",
        quantidade: 5,
        categoria: "Escritório",
      })
    ).resolves.not.toThrow();
  });

  it("should throw on failure", async () => {
    server.use(http.post(`${BASE_URL}`, () => HttpResponse.error()));

    await expect(
      requisitionService.sendRequisition({
        nome: "Produto",
        tipo: "Material",
        quantidade: 5,
        categoria: "Escritório",
      })
    ).rejects.toThrow();
  });
});

describe.skip("RequisitionService.updateProduct", () => {
  it("should update product", async () => {
    await expect(
      requisitionService.updateProduct({
        id: "1",
        quantidade: 20,
        descricao: "Atualizado",
      })
    ).resolves.not.toThrow();
  });

  it("should throw on failure", async () => {
    server.use(http.put(`${BASE_URL}/`, () => HttpResponse.error()));

    await expect(
      requisitionService.updateProduct({
        id: "1",
        quantidade: 20,
        descricao: "Atualizado",
      })
    ).rejects.toThrow();
  });
});

describe.skip("RequisitionService.updateProductStatus", () => {
  it("should approve status", async () => {
    await expect(
      requisitionService.updateProductStatus({
        id: "55",
        status: "aprovado",
        justificativa: "ok",
      })
    ).resolves.not.toThrow();
  });

  it("should throw on failure", async () => {
    server.use(
      http.put(`${BASE_URL}/aprove/:id`, () => HttpResponse.error())
    );

    await expect(
      requisitionService.updateProductStatus({
        id: "55",
        status: "aprovado",
        justificativa: "ok",
      })
    ).rejects.toThrow();
  });
});

describe.skip("RequisitionService.deleteProduct", () => {
  it("should delete a product", async () => {
    await expect(requisitionService.deleteProduct("1")).resolves.not.toThrow();
  });

  it("should throw on failure", async () => {
    server.use(http.delete(`${BASE_URL}/:id`, () => HttpResponse.error()));

    await expect(requisitionService.deleteProduct("1")).rejects.toThrow();
  });
});

describe.skip("RequisitionService.getAdmins", () => {
  it("should return admin list", async () => {
    const data = await requisitionService.getAdmins();
    expect(data[0].email).toBe("admin@fatec.sp.gov.br");
  });

  it("should throw on failure", async () => {
    server.use(http.get(`${USERS_URL}`, () => HttpResponse.error()));

    await expect(requisitionService.getAdmins()).rejects.toThrow();
  });
});

describe.skip("RequisitionService – token falsy branch", () => {
  beforeEach(() => {
    // Força token = null → cobre o branch do OR
    global.localStorage.getItem = jest.fn(() => null);
  });

  it("getProducts should work with empty token", async () => {
    const data = await requisitionService.getProducts();
    expect(data.length).toBe(2);
  });

  it("getAllProducts should work with empty token", async () => {
    const data = await requisitionService.getAllProducts();
    expect(data[0].user.nome).toBe("Admin");
  });

  it("sendRequisition should work with empty token", async () => {
    await expect(
      requisitionService.sendRequisition({
        nome: "Produto",
        tipo: "Material",
        quantidade: 5,
        categoria: "Escritório",
      })
    ).resolves.not.toThrow();
  });

  it("updateProduct should work with empty token", async () => {
    await expect(
      requisitionService.updateProduct({
        id: "1",
        quantidade: 20,
        descricao: "desc",
      })
    ).resolves.not.toThrow();
  });

  it("deleteProduct should work with empty token", async () => {
    await expect(requisitionService.deleteProduct("1")).resolves.not.toThrow();
  });

  it("updateProductStatus should work with empty token", async () => {
    await expect(
      requisitionService.updateProductStatus({
        id: "1",
        status: "aprovado",
        justificativa: "ok",
      })
    ).resolves.not.toThrow();
  });

  it("getAdmins should work with empty token", async () => {
    const data = await requisitionService.getAdmins();
    expect(data[0].email).toBe("admin@fatec.sp.gov.br");
  });
});

