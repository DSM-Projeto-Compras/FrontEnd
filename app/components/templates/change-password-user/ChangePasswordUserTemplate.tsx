"use client";

import React from "react";
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
  mensagem: string;
  erro: string;
  handleSendEmail: () => void;
  //handleVerifyCode: () => void;
  handleResetPassword: () => void;
}

const ChangePasswordUserTemplate: React.FC<Props> = ({
  step,
  email,
  setEmail,
  codigo,
  setCodigo,
  novaSenha,
  setNovaSenha,
  mensagem,
  erro,
  handleSendEmail,
  //handleVerifyCode,
  handleResetPassword,
}) => {
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

                        {erro && <p className="text-red-500 text-sm">{erro}</p>}
                        {mensagem && <p className="text-green-600 text-sm">{mensagem}</p>}

                        {step === 1 && (
                        <form
                            onSubmit={(e) => {
                            e.preventDefault();
                            handleSendEmail();
                            }}
                            className="space-y-4"
                        >
                            <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu email"
                            className="border border-gray-300 rounded-lg w-full p-2"
                            required
                            />
                            <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2"
                            >
                            Enviar código
                            </button>
                        </form>
                        )}

                        {step === 2 && (
                        <form
                            onSubmit={(e) => {
                            e.preventDefault();
                            handleResetPassword();
                            }}
                            className="space-y-4"
                        >
                            <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu email"
                            disabled
                            className="border border-gray-300 rounded-lg w-full p-2"
                            />

                            <input
                            type="text"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            placeholder="Código recebido"
                            className="border border-gray-300 rounded-lg w-full p-2"
                            required
                            />

                            <input
                            type="password"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            placeholder="Nova senha"
                            className="border border-gray-300 rounded-lg w-full p-2"
                            required
                            />
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
                            <a
                            href="login"
                            className="text-blue-700 hover:underline text-sm"
                            >
                            Volte para o login
                            </a> e entre com sua nova senha!
                            </p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordUserTemplate;