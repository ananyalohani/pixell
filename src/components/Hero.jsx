import React from "react";

const Hero = () => {
  return (
    <section className="w-full bg-gradient-to-tr to-purple-350 from-pink-350">
      <div className="polka-dot flex flex-col items-center justify-center w-full h-full p-24 sm:p-36 space-y-6">
        <p className="font-black text-white sm:text-5xl text-4xl">Pixell</p>
        <p className="font-semibold text-white text-center">
          Your pixel art NFT on the Ethereum Blockchain
        </p>
      </div>
    </section>
  );
};

export default Hero;
