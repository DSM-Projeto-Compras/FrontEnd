import * as Yup from "yup";

export const changePasswordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("A senha atual é obrigatória"),

  newPassword: Yup.string()
      .min(6, "A nova senha deve ter pelo menos 6 caracteres")
      .required("A nova senha é obrigatória")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial"
      ),

  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), undefined], "As novas senhas não correspondem")
    .required("A confirmação de nova senha é obrigatória"),
});