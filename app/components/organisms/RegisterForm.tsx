import React from "react";
import { useFormik } from "formik";
import { registerValidationSchema } from "@/app/validators/registerValidation";

interface RegisterFormProps {
  onRegister: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => void;
  errorMessages: string[];
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  errorMessages,
}) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values) => {
      onRegister(
        values.name,
        values.email,
        values.password,
        values.confirmPassword
      );
    },
  });

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-md">
        <form onSubmit={formik.handleSubmit} className="space-y-4 md:space-y-6">
          {errorMessages.length > 0 && (
            <div className="text-red-500 text-sm mb-2">
              {errorMessages.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900"
            >
              Nome
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Nome completo"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formik.errors.name && formik.touched.name
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="usuario@email.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formik.errors.email && formik.touched.email
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Senha
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formik.errors.password && formik.touched.password
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-900"
            >
              Confirmar senha
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 ${
                formik.errors.confirmPassword && formik.touched.confirmPassword
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Criar conta
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Já possui uma conta?{" "}
            <a
              href="login"
              className="font-medium text-blue-600 hover:underline"
            >
              Fazer login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;