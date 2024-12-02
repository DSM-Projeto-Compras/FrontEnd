import React, { useState } from "react";
import { Formik, Form } from "formik";
import TextFieldWrapper from "../../molecules/TextFieldWrapper";
import SelectWrapper from "../../atoms/SelectWrapper";
import Button from "../../atoms/Button";
import TextAreaField from "../../atoms/TextAreaField";
<<<<<<< HEAD
import { requisitionValidationSchema } from "../../../validators/requisitionValidation";
import RequisitionService from "../../../services/requisitionService"
=======
import { requisitionValidationSchema } from "@/app/validators/requisitionValidation";
import RequisitionService from "../../../services/requisitionService";
import SearchBecService from "../../../services/searchBecService";
>>>>>>> development
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
  } | null>(null); // Detalhes do produto

  const initialValues: RequisitionFormValues = {
    nome: "",
    tipo: "", // Tipo será atualizado quando os detalhes do produto forem obtidos
    quantidade: "",
    categoria: "",
    descricao: "",
  };

  const handleSubmit = async (values: any) => {
    console.log("Submitting values:", values);
    try {
      await RequisitionService.sendRequisition(values);
      alert("Requisição enviada com sucesso!");
    } catch (error) {
      alert("Erro ao enviar a requisição.");
    }
  };

  // Função para buscar sugestões de produto
  const handleProductSearch = async (
    prefixText: string,
    setFieldValue: any
  ) => {
    if (prefixText.length > 2) {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      const newTimeout = setTimeout(async () => {
        try {
          const results = await SearchBecService.getProducts(prefixText);
          setProductSuggestions(results.d.slice(0, 5)); // Limita as sugestões a 5
        } catch (error) {
          console.error(error);
        }
      }, 1000);

      setTypingTimeout(newTimeout);
    } else {
      setProductSuggestions([]); // Se o campo estiver vazio, limpa as sugestões
    }
    setFieldValue("nome", prefixText); // Atualiza o valor do campo 'nome'
  };

  // Função para buscar os detalhes do produto
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
          setFieldValue("tipo", newProductDetails.elementoDespesa); // Atualiza o campo "tipo"
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
                    // Outras categorias...
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
              <Button type="submit">Enviar</Button>
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
};

export default RequisitionTemplate;
