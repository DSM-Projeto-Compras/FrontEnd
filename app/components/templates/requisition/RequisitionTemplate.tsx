import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import TextFieldWrapper from "../../molecules/TextFieldWrapper";
import SelectWrapper from "../../atoms/SelectWrapper";
import Button from "../../atoms/Button";
import TextAreaField from "../../atoms/TextAreaField";
import { requisitionValidationSchema } from "../../../validators/requisitionValidation";
import RequisitionService from "../../../services/requisitionService"
import Header from "../../organisms/Header";

interface RequisitionTemplateProps {
  onLogout: () => void;
}

const RequisitionTemplate: React.FC<RequisitionTemplateProps> = ({
  onLogout,
}) => {
  const initialValues = {
    nome: "",
    tipo: "",
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

  return (
    <>
      <Header admin={false} />
      <section className="bg-white pt-28 mb-14">
        <Formik
          initialValues={initialValues}
          validationSchema={requisitionValidationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="px-4 mx-auto max-w-4xl">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Faça a Requisição do Produto Desejado
            </h2>
            <div className="flex flex-wrap mb-2">
              <TextFieldWrapper
                isWide={true}
                label="Nome*"
                id="nome"
                name="nome"
                placeholder="Digite o nome do produto"
              />

              <SelectWrapper
                isWide={false}
                label="Tipo*"
                id="tipo"
                name="tipo"
                options={[
                  { value: "material-de-consumo", label: "Material de Consumo" },
                  { value: "material-permanente", label: "Material Permanente" },
                  { value: "hibrido", label: "Híbrido" },
                  { value: "outro", label: "Outro" },
                  { value: "nao-sei", label: "Não sei (Pesquisar na BEC)" },
                ]}
              />
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
                  { value: "material-de-escritorio", label: "Material de Escritório" },
                  { value: "equipamentos-de-informatica", label: "Equipamentos de Informática" },
                  { value: "material-de-limpeza", label: "Material de Limpeza" },
                  { value: "materiais-didaticos-pedagogicos", label: "Materiais Didáticos e Pedagógicos" },
                  { value: "material-de-escritorio-especializado", label: "Material de Escritório Especializado" },
                  { value: "equipamentos-de-laboratorio", label: "Equipamentos de Laboratório" },
                  { value: "material-de-construcao-manutencao", label: "Material de Construção e Manutenção" },
                  { value: "moveis-equipamentos", label: "Móveis e Equipamentos" },
                  { value: "material-de-higiene-saude", label: "Material de Higiene e Saúde" },
                  { value: "materiais-para-eventos-projetos-especiais", label: "Materiais para Eventos e Projetos Especiais" },
                  { value: "materiais-esportivos-educacao-fisica", label: "Materiais Esportivos e de Educação Física" },
                  { value: "recursos-tecnologicos-multimidia", label: "Recursos Tecnológicos e Multimídia" },
                  { value: "material-de-arte-design", label: "Material de Arte e Design" },
                  { value: "material-de-jardinagem-paisagismo", label: "Material de Jardinagem e Paisagismo" },
                  { value: "material-de-seguranca-prevencao", label: "Material de Segurança e Prevenção" },
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
        </Formik>
      </section>
    </>
  );
};

export default RequisitionTemplate;
