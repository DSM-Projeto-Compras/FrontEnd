import React, { useState, useEffect } from "react";
import Header from "../../organisms/Header";
import FilterMenu, { FilterValues } from "../../organisms/Filter";
import RequisitonService from "../../../services/requisitionService";

interface Product {
  id: string;
  name: string;
  description: string;
  date: string;
  status: string;
  category: string;
  type: string;
}

const AdminDashboardTemplate: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleFilter = () => {
    setIsMenuOpen(!isMenuOpen);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await RequisitonService.getAllProducts();
        const products: Product[] = response.map((item) => ({
          id: item._id,
          name: item.nome,
          description: item.descricao || "",
          date: new Date().toISOString(),
          status: item.status,
          category: item.categoria,
          type: item.tipo,
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
                onClick={toggleFilter}
                className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-100"
              >
                {isMenuOpen ? "Fechar Filtro" : "Abrir Filtro"} &nbsp;
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
          {isMenuOpen && (
            <FilterMenu
              onFilterChange={setFilters}
              resetFilters={resetFilters}
            />
          )}

          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3">
                  Descrição
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

                  <td className="px-6 py-4">{product.date}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center text-sm font-medium text-gray-900">
                      <span
                        className={`w-3 h-3 me-3 rounded-full ${renderStatusDot(
                          product.status
                        )}`}
                      ></span>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="font-medium text-blue-600 hover:underline">
                      Editar
                    </button>
                    <button className="font-medium text-red-600 hover:underline ml-4">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardTemplate;
