import React from "react";
import Header from "../../organisms/Header";

interface ChangePasswordAdminTemplateProps {
  senhaAtual: string;
  novaSenha: string;
  confirmaNovaSenha: string;
  onSenhaAtualChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNovaSenhaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmaNovaSenhaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  mensagem: string;
}

const ChangePasswordAdminTemplate: React.FC<ChangePasswordAdminTemplateProps> = ({
  senhaAtual,
  novaSenha,
  confirmaNovaSenha,
  onSenhaAtualChange,
  onNovaSenhaChange,
  onConfirmaNovaSenhaChange,
  onSubmit,
  mensagem,
}) => {
  return (
        <div>
            <Header admin={true} />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto pt-28 mb-14">
                <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">Alterar senha</h1>
                        <div className="flex flex-col">
                            <div className="w-full max-w-md">
                                <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Senha atual
                                        </label>
                                        <input
                                            type="password"
                                            value={senhaAtual}
                                            onChange={onSenhaAtualChange}
                                            className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Nova Senha
                                        </label>
                                        <input
                                            type="password"
                                            value={novaSenha}
                                            onChange={onNovaSenhaChange}
                                            className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Confirmar Nova Senha
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmaNovaSenha}
                                            onChange={onConfirmaNovaSenhaChange}
                                            className="bg-gray-50 border border-gray-300 rounded-lg w-full p-2.5"
                                            required
                                        />
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