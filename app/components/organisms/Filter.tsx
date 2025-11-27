import React, { useState } from "react";

export interface FilterValues {
  name: string;
  status: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
}

interface FilterMenuProps {
  onFilterChange: (filters: FilterValues) => void;
  resetFilters: () => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  onFilterChange,
  resetFilters,
}) => {
  const [filters, setFilters] = useState<FilterValues>({
    name: "",
    status: "",
    category: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="origin-top-right absolute md:right-0 mt-2 w-auto rounded-md shadow-lg bg-white ring-2 ring-black ring-opacity-10 divide-y divide-gray-100 z-10">
      <div className="py-1 flex flex-wrap md:flex-nowrap justify-center">
        <div className="w-60 px-4">
          {/* Filtro por Nome */}
          <div className="mt-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={filters.name}
              onChange={handleInputChange}
              className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Digite o nome do produto"
            />
          </div>

          {/* Filtro por Status */}
          <div className="py-3">
            <span className="block text-sm font-medium text-gray-700">
              Status
            </span>
            <div className="mt-2 space-y-2">
              {["", "Pendente", "Negado", "Aprovado"].map((status) => (
                <div className="flex items-center" key={status}>
                  <input
                    type="radio"
                    id={status || "todos"}
                    name="status"
                    value={status}
                    onChange={handleInputChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    checked={filters.status === status}
                  />
                  <label
                    htmlFor={status || "todos"}
                    className="ml-3 flex items-center text-sm font-medium text-gray-500"
                  >
                    <span
                      className={`bg-${
                        status === "Aprovado"
                          ? "green-500"
                          : status === "Pendente"
                          ? "yellow-500"
                          : status === "Negado"
                          ? "red-500"
                          : "blue-500"
                      } w-3 h-3 me-3 rounded-full`}
                    ></span>
                    {status || "Todos"}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-60 px-4">
          {/* Filtro por Categoria */}
          <div className="my-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Categoria
            </label>
            <select
              name="category"
              id="category"
              value={filters.category}
              onChange={handleInputChange}
              className="my-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">Todas</option>
              <option value="material-de-escritorio">
                Material de Escritório
              </option>
              <option value="equipamentos-de-informatica">
                Equipamentos de Informática
              </option>
              <option value="material-de-limpeza">Material de Limpeza</option>
              <option value="materiais-didaticos-pedagogicos">
                Materiais Didáticos e Pedagógicos
              </option>
              <option value="material-de-escritorio-especializado">
                Material de Escritório Especializado
              </option>
              <option value="equipamentos-de-laboratorio">
                Equipamentos de Laboratório
              </option>
              <option value="material-de-construcao-manutencao">
                Material de Construção e Manutenção
              </option>
              <option value="moveis-equipamentos">Móveis e Equipamentos</option>
              <option value="material-de-higiene-saude">
                Material de Higiene e Saúde
              </option>
              <option value="materiais-para-eventos-projetos-especiais">
                Materiais para Eventos e Projetos Especiais
              </option>
              <option value="materiais-esportivos-educacao-fisica">
                Materiais Esportivos e Educação Física
              </option>
              <option value="recursos-tecnologicos-multimidia">
                Recursos Tecnológicos e Multimídia
              </option>
              <option value="material-de-arte-design">
                Material de Arte e Design
              </option>
              <option value="material-de-jardinagem-paisagismo">
                Material de Jardinagem e Paisagismo
              </option>
              <option value="material-de-seguranca-prevencao">
                Material de Segurança e Prevenção
              </option>
              <option value="outro">Outro</option>
            </select>
          </div>

          {/* Filtro por Tipo */}
          <div className="py-3">
            <span className="block text-sm font-medium text-gray-700">
              Tipo
            </span>
            <div className="mt-2 space-y-2">
              {[
                "",
                "material-permanente",
                "material-de-consumo",
                "hibrido",
              ].map((type) => (
                <div className="flex items-center" key={type}>
                  <input
                    type="radio"
                    id={type || "todos"}
                    name="type"
                    value={type}
                    onChange={handleInputChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    checked={filters.type === type}
                  />
                  <label
                    htmlFor={type || "todos"}
                    className="ml-3 block text-sm font-medium text-gray-500"
                  >
                    {type === "material-permanente"
                      ? "Material Permanente"
                      : type === "material-de-consumo"
                      ? "Material de Consumo"
                      : type === "hibrido"
                      ? "Híbrido"
                      : "Todos"}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
{/* mobile: data final abaixo da final */}
      <div className="flex items-center md:mx-2 my-2 justify-center">
        {/* Filtro por data */}
        <div className="flex flex-wrap md:flex-nowrap items-center mb-3 justify-center">
          <div className="relative">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Data Inicial:
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
              className="block bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div className="relative md:ml-4 mt-2 md:mt-0">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              Data Final:
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
              className="block bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="m-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-500"
      >
        Resetar Filtros
      </button>
    </div>
  );
};

export default FilterMenu;
