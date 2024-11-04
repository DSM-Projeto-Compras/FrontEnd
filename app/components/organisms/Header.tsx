import React from "react";
import { useRouter } from "next/navigation";
import Logo from "../molecules/Logo";

interface HeaderProps {
  admin: boolean;
}

const Header: React.FC<HeaderProps> = ({ admin = true }) => {
  const router = useRouter();

  const fazerLogout = () => {
    localStorage.removeItem("access_token");
    router.push("login");
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <header>
      <nav className="bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-200">
        <ul className="navigation max-w-[90vw] flex flex-wrap justify-between items-center relative mx-auto py-4">
          <Logo />
          <input type="checkbox" id="check" />
          <span className="menu flex [&>li]:pl-4 lg:[&>li]:pl-8 [&>li>a]:text-center [&>li>a]:relative [&>li>a]:transition [&>li>a]:duration-200 [&>li>a]:ease-in-out [&>li>a]:font-medium [&>li>a]:text-md lg:[&>li>a]:text-lg">
            {!admin && (
              <>
                <li>
                  <a
                    onClick={() => navigateTo("requisition")}
                    className="cursor-pointer"
                  >
                    Cadastrar Produto
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => navigateTo("historic")}
                    className="cursor-pointer"
                  >
                    Histórico
                  </a>
                </li>
              </>
            )}
            <li>
              <button
                type="button"
                onClick={fazerLogout}
                className="text-white relative bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-200 ease-in-out font-medium rounded-2xl text-lg px-6 py-1 text-center"
              >
                Sair
              </button>
            </li>
            <label htmlFor="check" className="close-menu">
              X
            </label>
          </span>
          <label htmlFor="check" className="open-menu font-medium">
            Menu
          </label>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
