import React from "react";
import Container from "./Container";
import Button from "./Button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="py-6 border-b">
      <Container className="flex flex-row items-center justify-between">
        <Link href="/">
          <h1 className="text-3xl font-black text-transparent cursor-pointer bg-clip-text bg-gradient-to-br from-pink-400 to-purple-400">
            Pixell
          </h1>
        </Link>
        <nav className="flex flex-row items-center space-x-3 sm:space-x-6">
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
      </Container>
    </header>
  );
};

export default Header;
