import React, { useEffect, useState } from "react";
import Container from "./Container";
import Button from "./Button";
import Link from "next/link";
import { MenuIcon } from "@heroicons/react/outline";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { fetcher } from "@/lib/api";
import {
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure,
  Slide,
} from "@chakra-ui/react";

const Header = () => {
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  const closeMobileMenu = () => setMobileMenu(false);
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    handleAuth(account).then((res) => console.log(res));
  }, [account]);

  const handleAuth = async (publicAddress: string | null | undefined) => {
    const response = await fetcher("/api/auth", "POST", { publicAddress });
    return response;
  };

  const handleConnectWallet = async () => {
    try {
      await activateBrowserWallet(undefined, true);
    } catch (err) {
      console.error(err);
      onToggle();
    }
  };

  return (
    <>
      <Slide direction="top" in={isOpen} style={{ zIndex: 10, top: isOpen ? 20 : 0 }}>
        <Box width="100%">
          <Alert status="error" width="container.sm" marginX="auto" rounded="md">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Metamask Not Found!</AlertTitle>
              <AlertDescription display="block" fontSize={"sm"}>
                Looks like you don't have the{" "}
                <a
                  href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
                  target="_blank"
                  rel="noopener"
                  className="font-medium underline"
                >
                  Metamask Extension
                </a>{" "}
                installed. Please install it, log into your account and try again.
              </AlertDescription>
            </Box>
            <CloseButton position="absolute" right="8px" top="8px" onClick={onToggle} />
          </Alert>
        </Box>
      </Slide>
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
            {account ? (
              <div className="flex flex-row items-center space-x-2">
                <img src="/ethereum.webp" className="w-auto h-8" />
                <p className="text-lg font-semibold text-purple-600">
                  {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3) + " ETH"}
                </p>
              </div>
            ) : (
              <Button
                onClick={handleConnectWallet}
                className="flex flex-row items-center space-x-2"
              >
                <img src="/metamask.png" className="w-auto h-8" />
                <p>Connect Wallet</p>
              </Button>
            )}
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
