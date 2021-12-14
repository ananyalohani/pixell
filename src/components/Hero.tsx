import React from "react";

const Hero = () => {
  return (
    <section className="w-full bg-gradient-to-tr to-purple-400 from-pink-400">
      <div className="flex flex-col items-center justify-center w-full h-full p-24 space-y-6 polka-grid sm:p-36">
        <p className="text-4xl font-black text-white sm:text-5xl">Pixell</p>
        <p className="text-lg font-bold text-center text-white">
          Your Pixel Art NFT on the Ethereum Blockchain
        </p>
      </div>
    </section>
  );
};

export default Hero;
