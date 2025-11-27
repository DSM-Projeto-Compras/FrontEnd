/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { useFormik } from "formik";
import { changePasswordValidationSchema } from "../../../../app/validators/changePasswordValidation";
import Header from "../../organisms/Header";

interface ChangePasswordAdminTemplateProps {
  onSubmit: (currentPassword: string, newPassword: string, confirmNewPassword: string) => Promise<boolean>;
  mensagem: string;
}

const ChangePasswordAdminTemplate = ({ 
    onSubmit,
    mensagem
  }: ChangePasswordAdminTemplateProps) => {

  const formik = useFormik({
    initialValues: {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    },
    validationSchema: changePasswordValidationSchema,
    onSubmit: async (values, helpers) => {
      const success = await onSubmit(values.currentPassword, values.newPassword, values.confirmNewPassword);

      if(success){
        helpers.resetForm();
      }
    }
});

  return (
        <div>
            <Header admin={true} />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto pt-28 mb-14">
                <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Alterar senha</h1>
                        <div className="flex flex-col">
                            <div className="w-full max-w-md">
                                <form onSubmit={formik.handleSubmit} className="space-y-4 md:space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Senha atual
                                        </label>
                                        <input
                                            data-testid="senhaAtual"
                                            type="password"
                                            name="currentPassword"
                                            id="currentPassword"
                                            value={formik.values.currentPassword}
                                            onChange={formik.handleChange}
                                            className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
                                            required
                                        />
                                        {formik.touched.currentPassword && formik.errors.currentPassword && (
                                            <p className="text-red-600 text-sm">{formik.errors.currentPassword}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nova Senha
                                        </label>
                                        <input
                                            data-testid="novaSenha"
                                            type="password"
                                            name="newPassword"
                                            id="newPassword"
                                            value={formik.values.newPassword}
                                            onChange={formik.handleChange}
                                            className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
                                            required
                                        />
                                        {formik.touched.newPassword && formik.errors.newPassword && (
                                            <p className="text-red-600 text-sm">{formik.errors.newPassword}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Confirmar Nova Senha
                                        </label>
                                        <input
                                            data-testid="confirmarSenha"
                                            type="password"
                                            name="confirmNewPassword"
                                            id="confirmNewPassword"
                                            value={formik.values.confirmNewPassword}
                                            onChange={formik.handleChange}
                                            className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
                                            required
                                        />
                                        {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword && (
                                            <p className="text-red-600 text-sm">{formik.errors.confirmNewPassword}</p>
                                        )}
                                    </div>
                                    <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Alterar senha</button>
                                     {mensagem && (
                                        <p className="text-center text-sm mt-2 text-gray-700">
                                        {mensagem}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordAdminTemplate;