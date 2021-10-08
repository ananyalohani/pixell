import React from "react";
import Container from "./Container";

function Header() {
  return (
    <header>
      <Container className="flex flex-row justify-between">
        <h1>Pixell</h1>
        <nav className="flex flex-row space-x-5">
          <div>Home</div>
          <div>Marketplace</div>
          <div>Create</div>
          <button>Connect Wallet</button>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
