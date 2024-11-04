import * as Yup from "yup";

export const registerValidationSchema = Yup.object().shape({
  name: Yup.string().required("O nome é obrigatório"),

  email: Yup.string()
    .email("O email informado não é válido")
    .required("O email é obrigatório"),

  password: Yup.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "As senhas não correspondem")
    .required("A confirmação de senha é obrigatória"),
});
