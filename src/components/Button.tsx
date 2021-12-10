import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
}

const Button = ({ className, children }: ButtonProps) => {
  return (
    <div
      className={`${className} bg-purple-400 text-white font-medium p-2 rounded cursor-pointer
      hover:filter hover:brightness-110 drop-shadow`}
    >
      {children}
    </div>
  );
};

export default Button;
