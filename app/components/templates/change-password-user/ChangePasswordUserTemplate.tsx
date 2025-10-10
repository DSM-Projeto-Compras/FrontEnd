"use client";

import React from "react";
import Header from "../../molecules/HeaderLogin";

const ChangePasswordUserTemplate: React.FC = () => {
    const [enviado, setEnviado] = React.useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setEnviado(true);
    }

    return (
        <div>
            <Header />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto pt-28 mb-14">
                <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Esqueci a senha</h1>
                        <div className="flex flex-col">
                            <div className="w-full max-w-md">
                                <form className="space-y-4 md:space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Digite seu email</label>
                                        <input type="email" name="email" id="email" data-testid="email" placeholder="usuario@email.com" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                                    </div>
                                    {!enviado ? (
                                        <button type="submit" onClick={handleSubmit} className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Enviar código</button>
                                    ) : (
                                        <p className="text-sm text-gray-600 bg-gray-100 rounded-lg p-2">Código enviado! Verifique seu email, incluindo a caixa de spam.</p>
                                    )}
                                    
                                    
                                </form>
                                
                                <div className="mt-4">
                                    <a href="login" className="text-sm text-blue-600 hover:text-blue-500">Voltar para login</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordUserTemplate;