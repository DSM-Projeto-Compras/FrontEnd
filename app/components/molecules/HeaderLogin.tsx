import React from 'react';
import Logo from './Logo';

const Header = () => (
  <header>
    <nav className="bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-200">
      <ul className="navigation max-w-[90vw] flex flex-wrap justify-between items-center relative mx-auto py-4">
          <a className="logo">
            <Logo />
          </a>
      </ul>
    </nav>
  </header>
);

export default Header;
