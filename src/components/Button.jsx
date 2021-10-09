import React from "react";

const Button = ({ className, children }) => {
  return (
    <div
      className={`${className} bg-purple-400 text-white font-medium p-2 rounded cursor-pointer
      hover:filter hover:brightness-110`}
    >
      {children}
    </div>
  );
};

export default Button;
