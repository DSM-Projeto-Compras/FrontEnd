import React from "react";
import Header from "../../molecules/HeaderLogin";
import LoginForm from "../../organisms/LoginForm";

const LoginTemplate: React.FC<{
  onLogin: (email: string, password: string, remember: boolean) => void;
  errorMessage?: string;
}> = ({ onLogin, errorMessage }) => (
  <>
    <Header />
    <section className="bg-white">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto pt-28 mb-14">
        <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Por favor, faça seu login
            </h1>
            <LoginForm onLogin={onLogin} errorMessage={errorMessage} />
          </div>
        </div>
      </div>
    </section>
  </>
);

export default LoginTemplate;
