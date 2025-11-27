import * as Yup from "yup";

const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/;
const cepRegex = /^\d{5}-?\d{3}$/;
const telefoneRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$|^\d{10,11}$/;

export const supplierValidationSchema = Yup.object({
  nome: Yup.string()
    .required("Nome é obrigatório")
    .min(2, "Nome deve ter no mínimo 2 caracteres"),
  cnpj: Yup.string()
    .required("CNPJ é obrigatório")
    .matches(
      cnpjRegex,
      "CNPJ inválido. Use o formato 00.000.000/0000-00 ou 14 dígitos"
    ),
  cep: Yup.string()
    .optional()
    .matches(cepRegex, "CEP inválido. Use o formato 00000-000"),
  rua: Yup.string().optional(),
  cidade: Yup.string().optional(),
  estado: Yup.string()
    .optional()
    .max(2, "Estado deve ter no máximo 2 caracteres"),
  numero: Yup.string().optional(),
  email: Yup.string().optional().email("Email inválido"),
  telefone: Yup.string()
    .optional()
    .matches(telefoneRegex, "Telefone inválido. Use o formato (00) 00000-0000"),
});
