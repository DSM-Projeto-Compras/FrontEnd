import React, { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import Header from "../../organisms/Header";
import SupplierService from "../../../services/supplierService";
import { supplierValidationSchema } from "../../../validators/supplierValidation";
import TextFieldWrapper from "../../molecules/TextFieldWrapper";
import Button from "../../atoms/Button";
import { cnpjMask, cepMask, phoneMask } from "../../../utils/masks";

interface Supplier {
  id: string;
  nome: string;
  cnpj: string;
  cep?: string;
  rua?: string;
  cidade?: string;
  estado?: string;
  numero?: string;
  email?: string;
  telefone?: string;
  dataCriacao: string;
}

interface SupplierFormValues {
  nome: string;
  cnpj: string;
  cep: string;
  rua: string;
  cidade: string;
  estado: string;
  numero: string;
  email: string;
  telefone: string;
}

const AdminSuppliersTemplate: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [suppliersPerPage] = useState<number>(7);
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [activeSupplierMenu, setActiveSupplierMenu] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#dropdownButton") && !target.closest(".dropdown-menu")) {
        setActiveSupplierMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const indexOfLastSupplier = currentPage * suppliersPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
  const currentSuppliers = filteredSuppliers.slice(
    indexOfFirstSupplier,
    indexOfLastSupplier
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredSuppliers.length / suppliersPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleSupplierMenu = (supplierId: string) => {
    setActiveSupplierMenu((prev) => (prev === supplierId ? null : supplierId));
  };

  const fetchSuppliers = async () => {
    try {
      const response = await SupplierService.getSuppliers();
      setAllSuppliers(response);
      setFilteredSuppliers(response);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allSuppliers.filter(
        (supplier) =>
          supplier.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.cnpj.includes(searchTerm)
      );
      setFilteredSuppliers(filtered);
    } else {
      setFilteredSuppliers(allSuppliers);
    }
    setCurrentPage(1);
  }, [searchTerm, allSuppliers]);

  const openCreateModal = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsCreateModalOpen(true);
    setActiveSupplierMenu(null);
  };

  const closeCreateModal = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsCreateModalOpen(false);
  };

  const openEditModal = (supplier: Supplier) => {
    setErrorMessage("");
    setSuccessMessage("");
    setEditingSupplier(supplier);
    setIsEditModalOpen(true);
    setActiveSupplierMenu(null);
  };

  const closeEditModal = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditModalOpen(false);
    setEditingSupplier(null);
  };

  const openDeleteModal = (supplier: Supplier) => {
    setDeletingSupplier(supplier);
    setIsDeleteModalOpen(true);
    setActiveSupplierMenu(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingSupplier(null);
  };

  const handleCreateSubmit = async (values: SupplierFormValues) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      await SupplierService.createSupplier(values);
      await fetchSuppliers();
      setSuccessMessage("Fornecedor cadastrado com sucesso!");
      setTimeout(() => {
        closeCreateModal();
        setSuccessMessage("");
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao criar fornecedor:", error);
      const errorMsg = error.response?.data?.message || 
                       error.response?.data?.errors?.[0]?.msg ||
                       "Erro ao cadastrar fornecedor. Verifique os dados.";
      setErrorMessage(errorMsg);
    }
  };

  const handleEditSubmit = async (values: SupplierFormValues) => {
    if (editingSupplier) {
      try {
        setErrorMessage("");
        setSuccessMessage("");
        await SupplierService.updateSupplier(editingSupplier.id, values);
        await fetchSuppliers();
        setSuccessMessage("Fornecedor atualizado com sucesso!");
        setTimeout(() => {
          closeEditModal();
          setSuccessMessage("");
        }, 1500);
      } catch (error: any) {
        console.error("Erro ao atualizar fornecedor:", error);
        const errorMsg = error.response?.data?.message || 
                         error.response?.data?.errors?.[0]?.msg ||
                         "Erro ao atualizar fornecedor. Verifique os dados.";
        setErrorMessage(errorMsg);
      }
    }
  };

  const handleDelete = async () => {
    if (deletingSupplier) {
      try {
        await SupplierService.deleteSupplier(deletingSupplier.id);
        await fetchSuppliers();
        closeDeleteModal();
      } catch (error) {
        console.error("Erro ao excluir fornecedor:", error);
      }
    }
  };

  const handleCepChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const maskedValue = cepMask(e.target.value);
    setFieldValue("cep", maskedValue);
    
    if (maskedValue && maskedValue.replace(/\D/g, "").length === 8) {
      try {
        const addressData = await SupplierService.getAddressByCep(maskedValue);
        setFieldValue("rua", addressData.logradouro || "");
        setFieldValue("cidade", addressData.localidade || "");
        setFieldValue("estado", addressData.uf || "");
      } catch (error) {
        console.error("Erro ao buscar endereço:", error);
      }
    }
  };

  const handleCnpjChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const maskedValue = cnpjMask(e.target.value);
    setFieldValue("cnpj", maskedValue);
  };

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const maskedValue = phoneMask(e.target.value);
    setFieldValue("telefone", maskedValue);
  };

  const initialCreateValues: SupplierFormValues = {
    nome: "",
    cnpj: "",
    cep: "",
    rua: "",
    cidade: "",
    estado: "",
    numero: "",
    email: "",
    telefone: "",
  };

  const isTextTooLong = (text: string) => {
    return text.length > 20;
  };

  return (
    <>
      <Header admin={true} />
      <div className="p-4 mx-auto max-w-5xl pt-28 mb-14">
        <div className="relative overflow shadow-md sm:rounded-lg">
          <div className="flex flex-wrap mb-4 justify-between items-center">
            <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Gerenciar Fornecedores
            </h1>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Buscar por nome ou CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100"
              >
                Adicionar Fornecedor
              </button>
            </div>
          </div>

          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3">
                  CNPJ
                </th>
                <th scope="col" className="px-6 py-3">
                  Cidade
                </th>
                <th scope="col" className="px-6 py-3">
                  Telefone
                </th>
                <th scope="col" className="px-6 py-3">
                  Data Cadastro
                </th>
                <th scope="col" className="px-6 py-3">
                  Opções
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSuppliers.map((supplier) => (
                <tr key={supplier.id} className="bg-white border-b">
                  <td className="px-6 py-4">
                    {isTextTooLong(supplier.nome) ? (
                      <span className="flex font-medium">
                        {supplier.nome.slice(0, 20)}... &nbsp;
                      </span>
                    ) : (
                      <span className="font-medium">{supplier.nome}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{supplier.cnpj}</td>
                  <td className="px-6 py-4">{supplier.cidade || "-"}</td>
                  <td className="px-6 py-4">{supplier.telefone || "-"}</td>
                  <td className="px-6 py-4">{formatDate(supplier.dataCriacao)}</td>
                  <td className="flex px-8 py-4 relative">
                    <button
                      id="dropdownButton"
                      onClick={() => toggleSupplierMenu(supplier.id)}
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

                    {activeSupplierMenu === supplier.id && (
                      <div
                        ref={menuRef}
                        className="dropdown-menu absolute z-10 w-40 bg-white rounded divide-y divide-gray-100 shadow top-10"
                      >
                        <ul className="py-1 text-sm text-gray-700">
                          <li>
                            <a
                              onClick={() => openEditModal(supplier)}
                              className="flex cursor-pointer px-4 py-2 text-sm hover:bg-gray-200"
                            >
                              Editar
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => openDeleteModal(supplier)}
                              className="flex cursor-pointer px-4 py-2 text-sm text-red-700 hover:bg-gray-200"
                            >
                              Excluir
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Modal de Cadastro */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Cadastrar Fornecedor</h2>
            <Formik
              initialValues={initialCreateValues}
              validationSchema={supplierValidationSchema}
              onSubmit={handleCreateSubmit}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="Nome*"
                      id="nome"
                      name="nome"
                      placeholder="Digite o nome do fornecedor"
                    />
                  </div>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="CNPJ*"
                      id="cnpj"
                      name="cnpj"
                      placeholder="00.000.000/0000-00"
                      onChange={(e) => handleCnpjChange(e, setFieldValue)}
                    />
                  </div>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="CEP"
                      id="cep"
                      name="cep"
                      placeholder="00000-000"
                      onChange={(e) => handleCepChange(e, setFieldValue)}
                    />
                  </div>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="Rua"
                      id="rua"
                      name="rua"
                      placeholder="Digite a rua"
                    />
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <TextFieldWrapper
                        label="Cidade"
                        id="cidade"
                        name="cidade"
                        placeholder="Digite a cidade"
                      />
                    </div>
                    <div className="w-24">
                      <TextFieldWrapper
                        label="Estado"
                        id="estado"
                        name="estado"
                        placeholder="UF"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="Número"
                      id="numero"
                      name="numero"
                      placeholder="Digite o número"
                    />
                  </div>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="Email"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="Telefone"
                      id="telefone"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      onChange={(e) => handlePhoneChange(e, setFieldValue)}
                    />
                  </div>
                  
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {errorMessage}
                    </div>
                  )}
                  
                  {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                      {successMessage}
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeCreateModal}
                      className="text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
                    >
                      Cancelar
                    </button>
                    <Button type="submit">Cadastrar</Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {isEditModalOpen && editingSupplier && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Editar Fornecedor</h2>
            <Formik
              initialValues={{
                nome: editingSupplier.nome,
                cnpj: editingSupplier.cnpj,
                cep: editingSupplier.cep || "",
                rua: editingSupplier.rua || "",
                cidade: editingSupplier.cidade || "",
                estado: editingSupplier.estado || "",
                numero: editingSupplier.numero || "",
                email: editingSupplier.email || "",
                telefone: editingSupplier.telefone || "",
              }}
              validationSchema={supplierValidationSchema}
              onSubmit={handleEditSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="Nome*"
                      id="nome"
                      name="nome"
                      placeholder="Digite o nome do fornecedor"
                    />
                  </div>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="CNPJ*"
                      id="cnpj"
                      name="cnpj"
                      placeholder="00.000.000/0000-00"
                      onChange={(e) => handleCnpjChange(e, setFieldValue)}
                    />
                  </div>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="CEP"
                      id="cep"
                      name="cep"
                      placeholder="00000-000"
                      onChange={(e) => handleCepChange(e, setFieldValue)}
                    />
                  </div>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="Rua"
                      id="rua"
                      name="rua"
                      placeholder="Digite a rua"
                    />
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <TextFieldWrapper
                        label="Cidade"
                        id="cidade"
                        name="cidade"
                        placeholder="Digite a cidade"
                      />
                    </div>
                    <div className="w-24">
                      <TextFieldWrapper
                        label="Estado"
                        id="estado"
                        name="estado"
                        placeholder="UF"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="Número"
                      id="numero"
                      name="numero"
                      placeholder="Digite o número"
                    />
                  </div>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="Email"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div className="mb-4">
                    <TextFieldWrapper
                      label="Telefone"
                      id="telefone"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      onChange={(e) => handlePhoneChange(e, setFieldValue)}
                    />
                  </div>
                  
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {errorMessage}
                    </div>
                  )}
                  
                  {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                      {successMessage}
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
                    >
                      Cancelar
                    </button>
                    <Button type="submit">Salvar</Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && deletingSupplier && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Excluir Fornecedor</h2>
            <p>
              Tem certeza que deseja excluir o fornecedor{" "}
              <strong>{deletingSupplier.nome}</strong>?
            </p>
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={closeDeleteModal}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDelete}
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

export default AdminSuppliersTemplate;
