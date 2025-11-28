"use client";

import React from "react";
import { useFormik } from "formik";
import { forgotStep1Validation } from "../../../../app/validators/forgotStep1Validation";
import { forgotStep2Validation } from "../../../../app/validators/forgotStep2Validation";
import Header from "../../molecules/HeaderLogin";

interface Props {
  step: number;
  setStep: (value: number) => void;
  email: string;
  setEmail: (value: string) => void;
  codigo: string;
  setCodigo: (value: string) => void;
  novaSenha: string;
  setNovaSenha: (value: string) => void;
  handleSendEmail: () => void;
  handleResetPassword: () => void;
}

const ChangePasswordUserTemplate: React.FC<Props> = ({
  step,
  setStep,
  email,
  setEmail,
  codigo,
  setCodigo,
  novaSenha,
  setNovaSenha,
  handleSendEmail,
  handleResetPassword,
}) => {
  
  const formik = useFormik({
    initialValues: {
        email,
        codigo,
        novaSenha,
    },
    validationSchema: step === 1 ? forgotStep1Validation : forgotStep2Validation,
    validateOnChange: false,
    validateOnBlur: false,

    onSubmit: async () => {
        if (step === 1) {
        await handleSendEmail();
        return;
        }

        if (step === 2) {
        await handleResetPassword();
        }
    },
    });

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto pt-28 mb-14">
        <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            
            <h1 className="text-xl font-bold text-gray-900">
              {step === 1 && "Esqueci a senha"}
              {step === 2 && "Redefina a senha"}
              {step === 3 && "Senha alterada com sucesso"}
            </h1>

            {step === 1 && (
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    formik.handleChange(e);
                  }}
                  placeholder="Digite seu email"
                  className="border border-gray-300 rounded-lg w-full p-2"
                />
                {formik.errors.email && (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
                >
                  Enviar código
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  disabled
                  className="border border-gray-300 rounded-lg w-full p-2"
                />

                <input
                  type="text"
                  name="codigo"
                  value={formik.values.codigo}
                  onChange={(e) => {
                    const formatted = e.target.value.replace(/\D/g, "");
                    if (formatted.length <= 6) {
                      setCodigo(formatted);
                      formik.setFieldValue("codigo", formatted);
                    }
                  }}
                  placeholder="Código recebido"
                  className="border border-gray-300 rounded-lg w-full p-2"
                  maxLength={6}
                />
                {formik.errors.codigo && (
                  <p className="text-red-500 text-sm">{formik.errors.codigo}</p>
                )}

                <input
                  type="password"
                  name="novaSenha"
                  value={formik.values.novaSenha}
                  onChange={(e) => {
                    setNovaSenha(e.target.value);
                    formik.handleChange(e);
                  }}
                  placeholder="Nova senha"
                  className="border border-gray-300 rounded-lg w-full p-2"
                />
                {formik.errors.novaSenha && (
                  <p className="text-red-500 text-sm">{formik.errors.novaSenha}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2"
                >
                  Redefinir senha
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="text-center">
                <p className="text-green-700 font-medium">
                  <a href="/pages/login" className="text-blue-700 hover:underline text-sm">
                    Volte para o login
                  </a>{" "}
                  e entre com sua nova senha!
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordUserTemplate;
