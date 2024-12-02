import * as Yup from "yup";

export const requisitionValidationSchema = Yup.object({
  nome: Yup.string().required("Nome é obrigatório"),
  quantidade: Yup.number()
    .min(1, "Quantidade deve ser pelo menos 1")
    .required("Quantidade é obrigatória"),
  categoria: Yup.string().required("Categoria é obrigatória"),
});
