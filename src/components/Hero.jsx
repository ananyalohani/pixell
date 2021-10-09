import React from "react";

const Hero = () => {
  return (
    <section className="w-full bg-gradient-to-tr from-purple-300 to-pink-300">
      <div className="polka-dot flex flex-col items-center justify-center w-full h-full p-36 space-y-6">
        <p className="font-black text-white text-5xl">Pixell</p>
        <p className="font-semibold text-white">
          Your pixel art NFT on the Ethereum Blockchain
        </p>
      </div>
    </section>
  );
};

export default Hero;
