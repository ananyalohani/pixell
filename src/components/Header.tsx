import React, { useState } from "react";
import Container from "./Container";
import Button from "./Button";
import Link from "next/link";
import { MenuIcon } from "@heroicons/react/outline";

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const closeMobileMenu = () => setMobileMenu(false);

  return (
    <>
      <header className="py-6 border-b">
        <Container className="flex flex-row items-center justify-between">
          <Link href="/">
            <h1 className="text-3xl font-black text-transparent cursor-pointer bg-clip-text bg-gradient-to-br from-pink-400 to-purple-400">
              Pixell
            </h1>
          </Link>

          {/* For screens larger than mobile */}
          <nav className="flex-row items-center hidden space-x-3 sm:flex sm:space-x-6">
            <Link href="/">
              <a className="font-medium text-gray-800">Home</a>
            </Link>
            <Link href="/marketplace">
              <a className="font-medium text-gray-800">Marketplace</a>
            </Link>
            <Link href="/create">
              <a className="font-medium text-gray-800">Create</a>
            </Link>
            <Button>Connect Wallet</Button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              className="outline-none mobile-menu-button"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              <MenuIcon className="w-8 h-8 text-gray-600" />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu */}
      <nav
        className={`-mt-3 z-10 border border-t absolute top-24 p-5 w-full flex-col items-center space-y-5 bg-gray-100 ${
          mobileMenu ? "flex" : "hidden"
        }`}
      >
        <Link href="/">
          <a className="font-medium text-gray-800" onClick={closeMobileMenu}>
            Home
          </a>
        </Link>
        <Link href="/marketplace">
          <a className="font-medium text-gray-800" onClick={closeMobileMenu}>
            Marketplace
          </a>
        </Link>
        <Link href="/create">
          <a className="font-medium text-gray-800" onClick={closeMobileMenu}>
            Create
          </a>
        </Link>
        <Button onClick={closeMobileMenu}>Connect Wallet</Button>
      </nav>
    </>
  );
};

export default Header;
