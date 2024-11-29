import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import TextFieldWrapper from "../../molecules/TextFieldWrapper";
import SelectWrapper from "../../atoms/SelectWrapper";
import Button from "../../atoms/Button";
import TextAreaField from "../../atoms/TextAreaField";
import { requisitionValidationSchema } from "@/app/validators/requisitionValidation";
import RequisitionService from "../../../services/requisitionService";
import SearchBecService from "../../../services/searchBecService";
import Header from "../../organisms/Header";

const RequisitionTemplate: React.FC = () => {
  const [productSuggestions, setProductSuggestions] = useState<string[]>([]);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const initialValues = {
    nome: "",
    quantidade: "",
    categoria: "",
    descricao: "",
  };

  const handleSubmit = async (values: any) => {
    try {
      await RequisitionService.sendRequisition(values);
      alert("Requisição enviada com sucesso!");
    } catch (error) {
      alert("Erro ao enviar a requisição.");
    }
  };

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
                  label="Nome do Produto*"
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
                        }}
                        className="suggestion-item"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
              <Button type="submit">Enviar</Button>
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
};

export default RequisitionTemplate;
