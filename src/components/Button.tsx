import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: (props: any) => any;
}

const Button = ({ className, children, onClick }: ButtonProps) => {
  return (
    <button
      className={`${className} bg-purple-400 text-white font-medium p-2 rounded cursor-pointer
      hover:filter hover:brightness-110 drop-shadow`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
