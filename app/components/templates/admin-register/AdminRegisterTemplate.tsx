"use client"

import { registerValidationSchema } from "@/app/validators/registerValidation";
import Header from "../../organisms/Header"
import { useFormik } from "formik";


const AdminRegisterTemplate: React.FC<{
    onRegister: (
        name: string,
        email: string
    ) => void;
    errorMessages?: string[];
}> = ({ onRegister, errorMessages = [] }) => {
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
        },
        onSubmit: (values) => {
            onRegister(values.name, values.email);
        },
        validationSchema: registerValidationSchema,
    });

    return (
        <div>
            <Header admin={true} />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto pt-28 mb-14">
                <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Crie uma nova conta de administrador</h1>
                    
                        <div className="flex flex-col">
                            <div className="w-full max-w-md">
                                <form
                                    onSubmit={formik.handleSubmit}
                                    className="space-y-4 md:space-y-6"
                                >
                                    {errorMessages.length > 0 && (
                                        <div className="text-red-500 text-sm mb-2">
                                            {errorMessages.map((message, index) => (
                                                <p key={index}>{message}</p>
                                            ))}
                                        </div>
                                    )}

                                    <div> { /* Campo Nome */}
                                        <label htmlFor="name" className="block text-sm font-medium">Nome</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            data-testid="name"
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
                                            <p className="mt-1 text-sm text-red-600">
                                            {formik.errors.name}
                                            </p>
                                        )}
                                    </div> {/* Fim Campo Nome */}
                                    
                                    <div> { /* Campo Email */}
                                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                                        <input
                                            type="text"
                                            name="email"
                                            id="email"
                                            data-testid="email"
                                            placeholder="Email"
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
                                            <p className="mt-1 text-sm text-red-600">
                                            {formik.errors.email}
                                            </p>
                                        )}
                                    </div> {/* Fim Campo Email */}

                                    
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Criar Conta
                                    </button>
                                    <p className="text-sm text-gray-400">Senha provisória gerada automaticamente e enviada para o email informado.</p>
                                    
                                </form>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div>
            <div>
                <h1>Admin Register</h1>
            </div>
        </div>
    )
}

export default AdminRegisterTemplate;