import * as Yup from "yup";

export const registerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("O nome é obrigatório")
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "O nome só pode conter letras e espaços")
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(80, "O nome deve manter no máximo 80 caracteres"),

  email: Yup.string()
    .email("O email informado não é válido")
    .matches(/@fatec\.sp\.gov\.br$/, "Apenas emails institucionais da Fatec")
    .required("O email é obrigatório")
    .min(17, "O email deve ter pelo menos 17 caracteres"),

  password: Yup.string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .required("A senha é obrigatória")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial"
    ),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "As senhas não correspondem")
    .required("A confirmação de senha é obrigatória"),
});