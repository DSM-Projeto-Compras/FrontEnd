import * as Yup from "yup";

export const forgotStep2Validation = Yup.object().shape({
  codigo: Yup.string()
    .required("Digite o código")
    .matches(/^\d{6}$/, "O código deve conter 6 números"),
    
  novaSenha: Yup.string()
    .min(6, "A nova senha deve ter pelo menos 6 caracteres")
    .required("A nova senha é obrigatória")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "A senha deve conter letra maiúscula, minúscula, número e caractere especial"
    ),
});