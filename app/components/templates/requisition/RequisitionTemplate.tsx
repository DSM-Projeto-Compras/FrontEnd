import React, { useState } from "react";
import { Formik, Form } from "formik";
import TextFieldWrapper from "../../molecules/TextFieldWrapper";
import SelectWrapper from "../../atoms/SelectWrapper";
import Button from "../../atoms/Button";
import TextAreaField from "../../atoms/TextAreaField";
import { requisitionValidationSchema } from "@/app/validators/requisitionValidation";
import RequisitionService from "../../../services/requisitionService";
import SearchBecService from "../../../services/searchBecService";
import Header from "../../organisms/Header";

interface RequisitionFormValues {
  nome: string;
  tipo: string;
  quantidade: string;
  categoria: string;
  descricao: string;
}

const RequisitionTemplate: React.FC = () => {
  const [productSuggestions, setProductSuggestions] = useState<string[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [productDetails, setProductDetails] = useState<{
    material: string;
    elementoDespesa: string;
    naturezaDespesa: string;
  } | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuggestionSelected, setIsSuggestionSelected] =
    useState<boolean>(false);

  const initialValues: RequisitionFormValues = {
    nome: "",
    tipo: "",
    quantidade: "",
    categoria: "",
    descricao: "",
  };

  const handleSubmit = async (values: any) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    // Checa se uma sugestão foi selecionada
    if (!isSuggestionSelected) {
      setErrorMessage("Por favor, selecione uma sugestão de produto.");
      return;
    }

    try {
      await RequisitionService.sendRequisition(values);
      setSuccessMessage("Produto solicitado com sucesso!");
    } catch (error) {
      setErrorMessage("Erro ao enviar a requisição.");
    }
  };

  const handleProductSearch = async (
    prefixText: string,
    setFieldValue: any
  ) => {
    setIsSuggestionSelected(false); // Reseta a seleção ao começar a digitar
    if (prefixText.length > 2) {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      const newTimeout = setTimeout(async () => {
        try {
          const results = await SearchBecService.getProducts(prefixText);
          setProductSuggestions(results.d.slice(0, 5));
        } catch (error) {
          console.error(error);
        }
      }, 1000);

      setTypingTimeout(newTimeout);
    } else {
      setProductSuggestions([]);
    }
    setFieldValue("nome", prefixText);
  };

  const fetchProductDetails = async (
    productName: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    try {
      const html = await SearchBecService.searchProduct(productName);

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const conteudoPesquisa = doc.getElementById(
        "ContentPlaceHolder1_gvResultadoPesquisa_lbTituloItem_0"
      );

      if (conteudoPesquisa) {
        const descricaoInput2 = conteudoPesquisa.innerHTML.split(" ")[0];

        const html2 = await SearchBecService.getProductDetails(descricaoInput2);

        const parser2 = new DOMParser();
        const doc2 = parser2.parseFromString(html2, "text/html");
        const elementoDespesa = doc2.getElementById(
          "ContentPlaceHolder1_lbNElementoDespesaInfo"
        );
        const material = doc2.getElementById(
          "ContentPlaceHolder1_lbMaterialInfo"
        );
        const naturezaDespesa = doc2.getElementById(
          "ContentPlaceHolder1_lbNdInfo"
        );

        if (elementoDespesa && material && naturezaDespesa) {
          const newProductDetails = {
            material: material.innerHTML,
            elementoDespesa: elementoDespesa.innerHTML,
            naturezaDespesa: naturezaDespesa.innerHTML,
          };
          setProductDetails(newProductDetails);
          setFieldValue("tipo", newProductDetails.elementoDespesa);
          setIsSuggestionSelected(true);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do produto:", error);
    }
  };

  return (
    <>
      <Header admin={false} />
      <section className="bg-white pt-28 mb-14">
        <Formik
          initialValues={initialValues}
          validationSchema={requisitionValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="px-4 mx-auto max-w-4xl">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                Faça a Requisição do Produto Desejado
              </h2>
              <div className="relative flex flex-wrap mb-2">
                <TextFieldWrapper
                  label="Nome do Produto* (selecione uma sugestão)"
                  id="nome"
                  name="nome"
                  placeholder="Digite o nome do produto"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleProductSearch(e.target.value, setFieldValue)
                  }
                />
                {productSuggestions.length > 0 && (
                  <ul className="absolute top-full left-0 z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-2 w-full">
                    {productSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setFieldValue("nome", suggestion);
                          setProductSuggestions([]);
                          fetchProductDetails(suggestion, setFieldValue);
                        }}
                        className="suggestion-item cursor-pointer p-2 hover:bg-gray-100"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {productDetails && (
                <div
                  id="informacoes"
                  className="flex flex-col w-full leading-6 p-4 mb-2 border-blue-200 border bg-blue-100 rounded-xl text-sm"
                >
                  <p className="font-semibold">Informações do produto</p>
                  <p id="p1">{productDetails.material}</p>
                  <p id="p2">{productDetails.elementoDespesa}</p>
                  <p id="p3">
                    {productDetails.naturezaDespesa.split("<br>")[0]}
                  </p>{" "}
                </div>
              )}

              <div className="flex flex-wrap">
                <TextFieldWrapper
                  isWide={false}
                  label="Quantidade*"
                  id="quantidade"
                  name="quantidade"
                  type="number"
                  placeholder="Digite a quantidade que precisa"
                />
                <SelectWrapper
                  isWide={true}
                  label="Categoria*"
                  id="categoria"
                  name="categoria"
                  options={[
                    {
                      value: "material-de-escritorio",
                      label: "Material de Escritório",
                    },
                    {
                      value: "equipamentos-de-informatica",
                      label: "Equipamentos de Informática",
                    },
                    {
                      value: "material-de-limpeza",
                      label: "Material de Limpeza",
                    },
                    {
                      value: "materiais-didaticos-pedagogicos",
                      label: "Materiais Didáticos e Pedagógicos",
                    },
                    {
                      value: "material-de-escritorio-especializado",
                      label: "Material de Escritório Especializado",
                    },
                    {
                      value: "equipamentos-de-laboratorio",
                      label: "Equipamentos de Laboratório",
                    },
                    {
                      value: "material-de-construcao-manutencao",
                      label: "Material de Construção e Manutenção",
                    },
                    {
                      value: "moveis-equipamentos",
                      label: "Móveis e Equipamentos",
                    },
                    {
                      value: "material-de-higiene-saude",
                      label: "Material de Higiene e Saúde",
                    },
                    {
                      value: "materiais-para-eventos-projetos-especiais",
                      label: "Materiais para Eventos e Projetos Especiais",
                    },
                    {
                      value: "materiais-esportivos-educacao-fisica",
                      label: "Materiais Esportivos e de Educação Física",
                    },
                    {
                      value: "recursos-tecnologicos-multimidia",
                      label: "Recursos Tecnológicos e Multimídia",
                    },
                    {
                      value: "material-de-arte-design",
                      label: "Material de Arte e Design",
                    },
                    {
                      value: "material-de-jardinagem-paisagismo",
                      label: "Material de Jardinagem e Paisagismo",
                    },
                    {
                      value: "material-de-seguranca-prevencao",
                      label: "Material de Segurança e Prevenção",
                    },
                    { value: "outro", label: "Outro" },
                  ]}
                />
              </div>
              <div className="sm:col-span-2 mt-4">
                <TextAreaField
                  label="Descrição"
                  id="descricao"
                  name="descricao"
                  placeholder="Digite a descrição do produto"
                />
              </div>
              <div className="flex items-center justify-center sm:place-items-start sm:justify-normal">
                <Button type="submit">Enviar</Button>

                {errorMessage && (
                  <div className="flex flex-col w-full items-center px-5 py-2.5 ml-5 mt-4 border-red-200 border bg-red-100 rounded-xl text-sm">
                    <p>{errorMessage}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="flex flex-col w-full items-center px-5 py-2.5 ml-5 mt-4 border-green-200 border bg-green-100 rounded-xl text-sm">
                    <p>{successMessage}</p>
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
};

export default RequisitionTemplate;
