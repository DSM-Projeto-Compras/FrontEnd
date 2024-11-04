import React from "react";
import { useFormik } from "formik";
import { loginValidationSchema } from "@/app/validators/loginValidation";

interface LoginFormProps {
  onLogin: (email: string, password: string, remember: boolean) => void;
  errorMessage?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, errorMessage }) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      onLogin(values.email, values.password, values.remember);
    },
  });

  const { handleSubmit, values, handleChange, handleBlur, errors, touched } =
    formik;

  return (
    <div className="flex flex-col">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {errorMessage && (
            <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="usuario@email.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                errors.email && touched.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                errors.password && touched.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="remember"
              id="remember"
              checked={values.remember}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Lembrar login
            </label>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Fazer login
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            Não possui conta?{" "}
            <a
              href="register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Cadastre-se
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
