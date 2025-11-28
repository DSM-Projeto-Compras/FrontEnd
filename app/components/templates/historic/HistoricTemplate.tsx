import React, { useState, useEffect, useRef } from "react";
import Header from "../../organisms/Header";
import FilterMenu, { FilterValues } from "../../organisms/Filter";
import RequisitonService from "../../../services/requisitionService";

interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  date: string;
  status: string;
  category: string;
  type: string;
  justification?: string;
  cod_id?: string;
  grupo?: string;
  classe?: string;
  material?: string;
  elemento?: string;
  natureza?: string;
}

const HistoricTemplate: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1); // Página atual
  const [productsPerPage] = useState<number>(7); // Número de produtos por página

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false); // Estado para o filtro
  const [activeProductMenu, setActiveProductMenu] = useState<string | null>(
    null
  ); // Estado para o menu de cada produto
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Effect para fechar o menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Verifica se o clique não foi no botão dropdown nem em nenhum elemento dentro do menu
      if (!target.closest('#dropdownButton') && !target.closest('.dropdown-menu')) {
        setActiveProductMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [filters, setFilters] = useState<FilterValues>({
    name: "",
    status: "",
    category: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const [showJustificationOnly, setShowJustificationOnly] =
    useState<boolean>(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editDescription, setEditDescription] = useState<string>("");
  const [editQuantity, setEditQuantity] = useState<number>(0);

  const menuRef = useRef<HTMLDivElement | null>(null); // Ref para o menu de opções
  const buttonRef = useRef<HTMLButtonElement | null>(null); // Ref para o botão que abre o menu

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

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditDescription(product.description);
    setEditQuantity(product.quantity);
    setIsEditModalOpen(true);
    setActiveProductMenu(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
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

  const handleEditSubmit = async () => {
    if (editingProduct) {
      try {
        // Chama o service para atualizar o produto
        console.log(editingProduct.id);
        await RequisitonService.updateProduct({
          id: editingProduct.id,
          descricao: editDescription,
          quantidade: editQuantity,
        });

        // Atualiza o estado local com o produto editado
        setAllProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editingProduct.id
              ? {
                  ...product,
                  description: editDescription,
                  quantity: editQuantity,
                }
              : product
          )
        );
        setFilteredProducts((prevFilteredProducts) =>
          prevFilteredProducts.map((product) =>
            product.id === editingProduct.id
              ? {
                  ...product,
                  description: editDescription,
                  quantity: editQuantity,
                }
              : product
          )
        );
        closeEditModal();
      } catch (error) {
        console.error("Erro ao editar produto:", error);
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await RequisitonService.getProducts();
        const products: Product[] = response.map((item) => ({
          id: item.id,
          name: item.nome,
          description: item.descricao || "",
          quantity: item.quantidade,
          date: item.data,
          status: item.status,
          category: item.categoria,
          type: item.tipo,
          justification: item.justificativa,
          cod_id: item.cod_id,
          grupo: item.grupo,
          classe: item.classe,
          material: item.material,
          elemento: item.elemento,
          natureza: item.natureza,
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

  useEffect(() => {
    // Função para detectar clique fora do menu
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setActiveProductMenu(null); // Fecha o menu de opções ao clicar fora
      }
    };

    // Adiciona o event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Limpa o event listener ao desmontar o componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        return "bg-blue-500";
      case "Pendente":
        return "bg-yellow-500";
      case "Negado":
        return "bg-red-500";
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

  const handleDeleteProduct = async (productId: string) => {
    try {
      // Chama o serviço para excluir o produto
      await RequisitonService.deleteProduct(productId);

      // Atualiza o estado para remover o produto deletado
      setAllProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      setFilteredProducts((prevFilteredProducts) =>
        prevFilteredProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  return (
    <>
      <Header admin={false} data-test-id="productList"/>
      <div className="p-4 mx-auto max-w-5xl pt-28 mb-14">
        <div className="flex flex-wrap mb-2">
            <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Históricos dos produtos requisitados
            </h1>
            <div className="justify-end md:ml-96 relative inline-block text-left p-4">
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
              {isFilterOpen && (
            <FilterMenu
              onFilterChange={setFilters}
              resetFilters={resetFilters}
            />
          )}
            </div>
            
          </div>
          
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {/* wrapper para permitir scroll horizontal em telas pequenas */}
          <div className="w-full overflow-x-auto">
          

            <table className="min-w-full table-auto text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
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
                {currentProducts.map((product, index) => (

                  <tr key={product.id ?? index} className="bg-white border-b">
                    <td className="px-6 py-4">
                      {isTextTooLong(product.name) ? (
                        <span className="flex font-medium break-words">
                          {product.name.slice(0, 20)}... &nbsp;
                        </span>
                      ) : (
                        <span className="font-medium break-words">{product.name}</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {isTextTooLong(product.description) ? (
                        <span className="flex break-words">
                          {product.description.slice(0, 20)}... &nbsp;
                        </span>
                      ) : (
                        <span className="break-words">{product.description}</span>
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

                    <td className="flex px-8 py-4 relative w-32">
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
                          className="dropdown-menu absolute z-50 w-40 bg-white rounded divide-y divide-gray-100 shadow top-10"
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
                                    onClick={() => openEditModal(product)}
                                    className="flex cursor-pointer px-4 py-2 text-sm text-blue-700 hover:bg-gray-200"
                                  >
                                    Editar &nbsp;
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
                                        d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                      />
                                    </svg>
                                  </a>
                                </li>
                                <li>
                                  <a
                                    href="#"
                                    className="flex cursor-pointer px-4 py-2 text-sm text-red-700 hover:bg-gray-200"
                                    onClick={() =>
                                      handleDeleteProduct(product.id)
                                    }
                                  >
                                    Cancelar &nbsp;
                                    <svg
                                      className="w-5 h-5"
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
        <div className="flex justify-between mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg w-[600px]">
            {" "}
            {/* Largura fixa de 500px */}
            <h2 className="text-xl font-bold mb-4">Editar Produto</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Quantidade
              </label>
              <input
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4} // Controla a altura do textarea (4 linhas de altura)
                className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md resize-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleEditSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
              >
                Salvar
              </button>
              <button
                onClick={closeEditModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
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
                {viewingProduct?.cod_id && (
                  <div className="mb-4">
                    <p className="block text-sm font-medium text-gray-700">
                      <strong>Código ID:</strong> {viewingProduct?.cod_id}
                    </p>
                  </div>
                )}
                {viewingProduct?.grupo && (
                  <div className="mb-4">
                    <p className="block text-sm font-medium text-gray-700 break-words">
                      <strong>Grupo:</strong> {viewingProduct?.grupo}
                    </p>
                  </div>
                )}
                {viewingProduct?.classe && (
                  <div className="mb-4">
                    <p className="block text-sm font-medium text-gray-700 break-words">
                      <strong>Classe:</strong> {viewingProduct?.classe}
                    </p>
                  </div>
                )}
                {viewingProduct?.material && (
                  <div className="mb-4">
                    <p className="block text-sm font-medium text-gray-700 break-words">
                      <strong>Material:</strong> {viewingProduct?.material}
                    </p>
                  </div>
                )}
                {viewingProduct?.elemento && (
                  <div className="mb-4">
                    <p className="block text-sm font-medium text-gray-700 break-words">
                      <strong>Elemento:</strong> {viewingProduct?.elemento}
                    </p>
                  </div>
                )}
                {viewingProduct?.natureza && (
                  <div className="mb-4">
                    <p className="block text-sm font-medium text-gray-700 break-words">
                      <strong>Natureza:</strong> {viewingProduct?.natureza}
                    </p>
                  </div>
                )}
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
    </>
  );
};

export default HistoricTemplate;
