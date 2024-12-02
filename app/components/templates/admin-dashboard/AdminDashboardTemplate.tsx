import React, { useState, useEffect, useRef } from "react";
import Header from "../../organisms/Header";
import FilterMenu, { FilterValues } from "../../organisms/Filter";
import RequisitonService from "../../../services/requisitionService";

interface Product {
  id: string;
  name: string;
  user: string;
  description: string;
  quantity: number;
  date: string;
  status: string;
  category: string;
  type: string;
  justification?: string;
}

const AdminDashboardTemplate: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false); // Estado para o filtro
  const [activeProductMenu, setActiveProductMenu] = useState<string | null>(
    null
  ); // Estado para o menu de cada produto
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterValues>({
    name: "",
    status: "",
    category: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const [showJustificationOnly, setShowJustificationOnly] =
    useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement | null>(null); // Ref para o menu de opções
  const buttonRef = useRef<HTMLButtonElement | null>(null); // Ref para o botão que abre o menu

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [justification, setJustification] = useState<string>("");

  const openConfirmModal = (productId: string) => {
    setSelectedProductId(productId);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setSelectedProductId(null);
    setJustification("");
    setIsConfirmModalOpen(false);
  };

  const handleJustificationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJustification(e.target.value);
  };

  const confirmDisapproval = async () => {
    setActiveProductMenu(null);
    if (selectedProductId) {
      try {
        await RequisitonService.updateProductStatus({
          _id: selectedProductId,
          status: "Negado",
          justificativa: justification, // Justificativa opcional
        });
        const updatedProducts = allProducts.map((product) =>
          product.id === selectedProductId
            ? { ...product, status: "Negado" }
            : product
        );
        setAllProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        closeConfirmModal();
      } catch (error) {
        console.error("Erro ao negar produto:", error);
      }
    }
  };

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev); // Alterna o filtro sem interferir no menu de produto
  };

  const toggleProductMenu = (productId: string) => {
    setActiveProductMenu((prev) => (prev === productId ? null : productId)); // Alterna o menu do produto
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    if (filters.name) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (product) => product.status === filters.status
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    if (filters.type) {
      filtered = filtered.filter((product) => product.type === filters.type);
    }

    if (filters.startDate) {
      filtered = filtered.filter(
        (product) => product.date >= filters.startDate
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter((product) => product.date <= filters.endDate);
    }

    const uniqueIds = new Set();
    const uniqueFiltered = filtered.filter((product) => {
      if (!uniqueIds.has(product.id)) {
        uniqueIds.add(product.id);
        return true;
      }
      return false;
    });

    setFilteredProducts(uniqueFiltered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openDetailModal = (product: Product, showJustification: boolean) => {
    setViewingProduct(product); // Configura o produto correto
    setShowJustificationOnly(showJustification);
    setIsDetailModalOpen(true); // Abre o modal
    setActiveProductMenu(null);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false); // Fecha o modal
    setViewingProduct(null); // Limpa o estado de visualização
  };

  const approve = async (id: string) => {
    setActiveProductMenu(null);
    try {
      await RequisitonService.updateProductStatus({
        _id: id,
        status: "Aprovado", // Status aprovado
        justificativa: "", // Justificativa vazia
      });
      // Atualizar a lista de produtos após a aprovação
      const updatedProducts = allProducts.map((product) =>
        product.id === id ? { ...product, status: "Aprovado" } : product
      );
      setAllProducts(updatedProducts);
      setFilteredProducts(updatedProducts); // Atualizar os produtos filtrados também
    } catch (error) {
      console.error("Erro ao aprovar produto:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await RequisitonService.getAllProducts();
        const products: Product[] = response.map((item) => ({
          id: item._id,
          user: item.userId.nome,
          name: item.nome,
          description: item.descricao || "",
          quantity: item.quantidade,
          date: item.data,
          status: item.status,
          category: item.categoria,
          type: item.tipo,
          justification: item.justificativa,
        }));

        setAllProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      name: "",
      status: "",
      category: "",
      type: "",
      startDate: "",
      endDate: "",
    });
    setFilteredProducts(allProducts);
  };

  const isTextTooLong = (text: string) => {
    return text.length > 20;
  };

  const renderStatusDot = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-500";
      case "Pendente":
        return "bg-yellow-500";
      case "Negado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <Header admin={true} />
      <div className="p-4 mx-auto max-w-5xl pt-28 mb-14">
        <div className="relative overflow shadow-md sm:rounded-lg">
          <div className="flex flex-wrap mb-2">
            <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Lista de Produtos Solicitados
            </h1>
            <div className="justify-end ml-96 relative inline-block text-left p-4">
              <button
                ref={buttonRef}
                onClick={toggleFilter}
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-100"
              >
                {isFilterOpen ? "Fechar Filtro" : "Abrir Filtro"} &nbsp;
                <svg
                  className="w-4 h-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25"
                  />
                </svg>
              </button>
            </div>
          </div>
          {isFilterOpen && (
            <FilterMenu
              onFilterChange={setFilters}
              resetFilters={resetFilters}
            />
          )}

          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Solicitante
                </th>
                <th scope="col" className="px-6 py-3">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3">
                  Descrição
                </th>
                <th scope="col" className="px-2 py-3">
                  QTD.
                </th>
                <th scope="col" className="px-6 py-3">
                  Data
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Opções
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="bg-white border-b">
                  <td className="px-6 py-4">
                    {isTextTooLong(product.user) ? (
                      <span className="flex font-medium">
                        {product.user.slice(0, 20)}... &nbsp;
                      </span>
                    ) : (
                      <span className="font-medium">{product.user}</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {isTextTooLong(product.name) ? (
                      <span className="flex font-medium">
                        {product.name.slice(0, 20)}... &nbsp;
                      </span>
                    ) : (
                      <span className="font-medium">{product.name}</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {isTextTooLong(product.description) ? (
                      <span className="flex">
                        {product.description.slice(0, 20)}... &nbsp;
                      </span>
                    ) : (
                      <span>{product.description}</span>
                    )}
                  </td>

                  <td className="px-2 py-4">{product.quantity}</td>
                  <td className="px-6 py-4">{formatDate(product.date)}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center text-sm font-medium text-gray-900">
                      <span
                        className={`w-3 h-3 me-3 rounded-full ${renderStatusDot(
                          product.status
                        )}`}
                      />
                      {product.status}
                    </span>
                  </td>

                  <td className="flex px-8 py-4 relative">
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

                    {activeProductMenu === product.id && (
                      <div
                        ref={menuRef}
                        className="absolute z-10 w-40 bg-white rounded divide-y divide-gray-100 shadow top-10"
                      >
                        <ul className="py-1 text-sm text-gray-700">
                          {/* Condicional para as opções de acordo com o status */}
                          <li>
                            <a
                              onClick={() => openDetailModal(product, false)}
                              className="flex cursor-pointer px-4 py-2 text-sm hover:bg-gray-200"
                            >
                              Ver detalhes
                            </a>
                          </li>
                          {product.status === "Pendente" && (
                            <>
                              <li>
                                <a
                                  onClick={() => approve(product.id)}
                                  className="flex cursor-pointer px-4 py-2 text-sm text-green-700 hover:bg-gray-200"
                                >
                                  Aprovar &nbsp;
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 11.917 9.724 16.5 19 7.5"
                                    />
                                  </svg>
                                </a>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  className="flex cursor-pointer px-4 py-2 text-sm text-red-700 hover:bg-gray-200"
                                  onClick={() => openConfirmModal(product.id)}
                                >
                                  Negar &nbsp;
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M6 18 17.94 6M18 18 6.06 6"
                                    />
                                  </svg>
                                </a>
                              </li>
                            </>
                          )}
                          {product.status === "Negado" && (
                            <li>
                              <a
                                onClick={() => openDetailModal(product, true)}
                                className="flex cursor-pointer px-4 py-2 text-sm hover:bg-gray-200"
                              >
                                Ver justificativa &nbsp;
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailModalOpen && viewingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg w-[600px]">
            {/* Largura fixa de 600px */}
            <h2 className="text-xl font-bold mb-4">Detalhes do Produto</h2>
            {!showJustificationOnly ? (
              <>
                <div className="mb-4">
                  <p className="block text-sm font-medium text-gray-700 break-words">
                    <strong>Nome:</strong> {viewingProduct?.name}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="block text-sm font-medium text-gray-700">
                    <strong>Quantidade:</strong> {viewingProduct?.quantity}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="block text-sm font-medium text-gray-700 break-words">
                    <strong>Descrição:</strong> {viewingProduct?.description}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="block text-sm font-medium text-gray-700">
                    <strong>Data:</strong> {formatDate(viewingProduct?.date)}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="block text-sm font-medium text-gray-700">
                    <strong>Status:</strong> {viewingProduct?.status}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="block text-sm font-medium text-gray-700">
                    <strong>Categoria:</strong> {viewingProduct?.category}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="block text-sm font-medium text-gray-700">
                    <strong>Tipo:</strong> {viewingProduct?.type}
                  </p>
                </div>
              </>
            ) : (
              <div className="mb-4">
                <p className="block text-sm font-medium text-gray-700 break-words">
                  <strong>Justificativa:</strong>{" "}
                  {viewingProduct?.justification ? (
                    viewingProduct.justification
                  ) : (
                    <span>Nenhuma justificativa fornecida.</span>
                  )}
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={closeDetailModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Negar Produto</h2>
            <p>Tem certeza que deseja negar este produto?</p>

            <label className="block mt-4">
              Justificativa (opcional):
              <textarea
                className="w-full mt-2 p-2 border border-gray-300 rounded resize-none"
                value={justification}
                onChange={handleJustificationChange}
                placeholder="Digite uma justificativa (opcional)"
              />
            </label>

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={closeConfirmModal}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmDisapproval}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardTemplate;
