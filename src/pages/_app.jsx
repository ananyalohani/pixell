import "tailwindcss/tailwind.css";
import "../styles/global.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const App = ({ Component, pageProps }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
