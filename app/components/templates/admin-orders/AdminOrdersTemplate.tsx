"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../../organisms/Header";
import requisitionService from "@/app/services/requisitionService";
import supplierService from "@/app/services/supplierService";

interface Product {
  id: string;
  nome: string;
  tipo: string;
  quantidade: number;
  categoria: string;
  status: string;
  descricao?: string;
  data: string;
  user: {
    id: string;
    nome: string;
  };
  justificativa?: string;
  supplierId?: string;
  supplier?: {
    id: string;
    nome: string;
    cnpj: string;
    ativado: boolean;
  };
}

interface Supplier {
  id: string;
  nome: string;
  cnpj: string;
}

export default function AdminOrdersTemplate() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeProductMenu, setActiveProductMenu] = useState<string | null>(
    null
  );
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest("#dropdownButton") &&
        !target.closest(".dropdown-menu")
      ) {
        setActiveProductMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, suppliersData] = await Promise.all([
        requisitionService.getAllProducts(),
        supplierService.getSuppliers(),
      ]);
      setProducts(productsData);
      setSuppliers(suppliersData);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      alert(
        errorMessage || "Erro ao carregar dados. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRealized = async () => {
    if (!selectedProduct || !selectedSupplier) {
      alert("Selecione um fornecedor para continuar.");
      return;
    }

    try {
      await requisitionService.markAsRealized(
        selectedProduct.id,
        selectedSupplier
      );
      alert("Pedido marcado como Realizado.");
      setShowSupplierModal(false);
      setSelectedProduct(null);
      setSelectedSupplier("");
      await loadData();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      alert(errorMessage || "Erro ao marcar como Realizado. Tente novamente.");
    }
  };

  const handleMarkAsDelivered = async (product: Product) => {
    setActiveProductMenu(null);
    try {
      await requisitionService.markAsDelivered(product.id);
      alert("Pedido marcado como Entregue.");
      await loadData();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      alert(errorMessage || "Erro ao marcar como Entregue. Tente novamente.");
    }
  };

  const handleMarkAsFinalized = async (product: Product) => {
    setActiveProductMenu(null);
    try {
      await requisitionService.markAsFinalized(product.id);
      alert("Pedido marcado como Finalizado.");
      await loadData();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      alert(errorMessage || "Erro ao marcar como Finalizado. Tente novamente.");
    }
  };

  const handleRevertStatus = async (product: Product) => {
    setActiveProductMenu(null);
    try {
      await requisitionService.revertProductStatus(product.id);
      alert("Status revertido com sucesso.");
      await loadData();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      alert(errorMessage || "Erro ao reverter status. Tente novamente.");
    }
  };

  const toggleProductMenu = (productId: string) => {
    setActiveProductMenu((prev) => (prev === productId ? null : productId));
  };

  const openSupplierModal = (product: Product) => {
    setSelectedProduct(product);
    setShowSupplierModal(true);
    setSelectedSupplier("");
    setActiveProductMenu(null);
  };

  const openDetailsModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
    setActiveProductMenu(null);
  };

  const closeModals = () => {
    setShowSupplierModal(false);
    setShowDetailsModal(false);
    setSelectedProduct(null);
    setSelectedSupplier("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getSupplierName = (product: Product) => {
    // Primeiro verifica se o produto tem o supplier diretamente (incluído no backend)
    if (product.supplier) {
      return product.supplier.nome;
    }
    // Fallback: busca na lista de suppliers (apenas ativos)
    if (!product.supplierId) return "Não atribuído";
    const supplier = suppliers.find((s) => s.id === product.supplierId);
    return supplier ? supplier.nome : "Não encontrado";
  };

  if (loading) {
    return (
      <>
        <Header admin={true} />
        <div className="flex items-center justify-center min-h-screen">
          <p>Carregando pedidos...</p>
        </div>
      </>
    );
  }

  const renderStatusDot = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-blue-500";
      case "Realizado":
        return "bg-green-500";
      case "Entregue":
        return "bg-purple-500";
      case "Finalizado":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  const Column = ({ title, status }: { title: string; status: string }) => {
    const items = products.filter((product) => product.status === status);

    return (
      <div className="flex-1 min-w-[280px]">
        <div className="bg-gray-50 border rounded-lg">
          <div className="bg-gray-100 p-3 rounded-t-lg font-semibold text-gray-700 border-b">
            {title} ({items.length})
          </div>
          <div className="p-2 min-h-[400px]">
            {items.length === 0 ? (
              <p className="text-center text-gray-400 text-sm mt-4">
                Nenhum pedido
              </p>
            ) : (
              <div className="space-y-2">
                {items.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border rounded p-3 hover:shadow-md transition-shadow relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-8">
                        <h3 className="font-medium text-gray-800 text-sm mb-1">
                          {product.nome}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Fornecedor: {getSupplierName(product)}
                        </p>
                      </div>

                      <button
                        id="dropdownButton"
                        onClick={() => toggleProductMenu(product.id)}
                        className="text-gray-500 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm p-1.5"
                        type="button"
                      >
                        <span className="sr-only">Abrir menu</span>
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 16 3"
                        >
                          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                        </svg>
                      </button>
                    </div>

                    {activeProductMenu === product.id && (
                      <div
                        ref={menuRef}
                        className="dropdown-menu absolute z-10 w-52 bg-white rounded divide-y divide-gray-100 shadow right-2 top-10"
                      >
                        <ul className="py-1 text-sm text-gray-700">
                          <li>
                            <a
                              onClick={() => openDetailsModal(product)}
                              className="flex cursor-pointer px-4 py-2 text-sm hover:bg-gray-200"
                            >
                              Ver detalhes
                            </a>
                          </li>

                          {status === "Aprovado" && (
                            <li>
                              <a
                                onClick={() => openSupplierModal(product)}
                                className="flex cursor-pointer px-4 py-2 text-sm text-green-700 hover:bg-gray-200"
                              >
                                Marcar como Realizado &nbsp;
                                <svg
                                  className="w-4 h-4"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 12H5m14 0-4 4m4-4-4-4"
                                  />
                                </svg>
                              </a>
                            </li>
                          )}

                          {status === "Realizado" && (
                            <>
                              <li>
                                <a
                                  onClick={() => handleMarkAsDelivered(product)}
                                  className="flex cursor-pointer px-4 py-2 text-sm text-purple-700 hover:bg-gray-200"
                                >
                                  Marcar como Entregue &nbsp;
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 12H5m14 0-4 4m4-4-4-4"
                                    />
                                  </svg>
                                </a>
                              </li>
                              <li>
                                <a
                                  onClick={() => handleRevertStatus(product)}
                                  className="flex cursor-pointer px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
                                >
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 12h14M5 12l4-4m-4 4 4 4"
                                    />
                                  </svg>
                                  Voltar para Aprovado
                                </a>
                              </li>
                            </>
                          )}

                          {status === "Entregue" && (
                            <>
                              <li>
                                <a
                                  onClick={() => handleMarkAsFinalized(product)}
                                  className="flex cursor-pointer px-4 py-2 text-sm text-indigo-700 hover:bg-gray-200"
                                >
                                  Marcar como Finalizado &nbsp;
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 12H5m14 0-4 4m4-4-4-4"
                                    />
                                  </svg>
                                </a>
                              </li>
                              <li>
                                <a
                                  onClick={() => handleRevertStatus(product)}
                                  className="flex cursor-pointer px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
                                >
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 12h14M5 12l4-4m-4 4 4 4"
                                    />
                                  </svg>
                                  Voltar para Realizado
                                </a>
                              </li>
                            </>
                          )}

                          {status === "Finalizado" && (
                            <li>
                              <a
                                onClick={() => handleRevertStatus(product)}
                                className="flex cursor-pointer px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 12h14M5 12l4-4m-4 4 4 4"
                                  />
                                </svg>
                                Voltar para Entregue
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header admin={true} />
      <div className="p-4 mx-auto max-w-7xl pt-28 mb-14">
        <div className="mb-6">
          <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            Gerenciamento de Pedidos
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Column title="Aprovados" status="Aprovado" />
          <Column title="Realizados" status="Realizado" />
          <Column title="Entregues" status="Entregue" />
          <Column title="Finalizados" status="Finalizado" />
        </div>
      </div>

      {/* Modal de Seleção de Fornecedor */}
      {showSupplierModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Selecionar Fornecedor
            </h2>
            <p className="text-gray-600 mb-4">
              Pedido:{" "}
              <span className="font-semibold">{selectedProduct.nome}</span>
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Fornecedor *
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um fornecedor</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.nome} - {supplier.cnpj}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleMarkAsRealized}
                disabled={!selectedSupplier}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={closeModals}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Detalhes do Pedido
            </h2>

            <div className="space-y-3 text-gray-700">
              <div>
                <span className="font-semibold">Nome:</span>{" "}
                {selectedProduct.nome}
              </div>
              <div>
                <span className="font-semibold">Tipo:</span>{" "}
                {selectedProduct.tipo}
              </div>
              <div>
                <span className="font-semibold">Quantidade:</span>{" "}
                {selectedProduct.quantidade}
              </div>
              <div>
                <span className="font-semibold">Categoria:</span>{" "}
                {selectedProduct.categoria}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span className="flex items-center text-sm font-medium text-gray-900">
                  <span
                    className={`w-3 h-3 me-2 rounded-full ${renderStatusDot(
                      selectedProduct.status
                    )}`}
                  />
                  {selectedProduct.status}
                </span>
              </div>
              <div>
                <span className="font-semibold">Data:</span>{" "}
                {formatDate(selectedProduct.data)}
              </div>
              <div>
                <span className="font-semibold">Solicitante:</span>{" "}
                {selectedProduct.user.nome}
              </div>
              <div>
                <span className="font-semibold">Fornecedor:</span>{" "}
                {getSupplierName(selectedProduct)}
              </div>
              {selectedProduct.descricao && (
                <div>
                  <span className="font-semibold">Descrição:</span>{" "}
                  {selectedProduct.descricao}
                </div>
              )}
              {selectedProduct.justificativa && (
                <div>
                  <span className="font-semibold">Justificativa:</span>{" "}
                  {selectedProduct.justificativa}
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={closeModals}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
