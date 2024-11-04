import React from "react";
import Header from "../../molecules/HeaderLogin";
import RegisterForm from "../../organisms/RegisterForm";

const RegisterTemplate: React.FC<{
  onRegister: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => void;
  errorMessages: string[];
}> = ({ onRegister, errorMessages }) => (
  <>
    <Header />
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto pt-28 mb-14">
        <div className="w-full bg-white rounded-lg shadow-2xl md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Crie sua conta
            </h1>
            <RegisterForm
              onRegister={onRegister}
              errorMessages={errorMessages}
            />
          </div>
        </div>
      </div>
    </section>
  </>
);

export default RegisterTemplate;
