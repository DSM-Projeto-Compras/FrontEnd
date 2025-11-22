import * as Yup from "yup";

export const forgotStep1Validation = Yup.object().shape({
  email: Yup.string()
    .email("Digite um email válido")
    .required("O email é obrigatório"),
});