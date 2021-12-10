import "../styles/global.css";
import "../styles/tailwind.css";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GridContextProvider } from "@/context/GridContext";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <GridContextProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-col flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </GridContextProvider>
  );
};

export default App;
