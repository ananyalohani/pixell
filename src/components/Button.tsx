import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: (props: any) => any;
  type?: "button" | "submit" | "reset";
}

const Button = React.forwardRef(
  (
    { className, children, onClick, type }: ButtonProps,
    ref: React.LegacyRef<HTMLButtonElement>
  ) => {
    return (
      <button
        className={`${className} bg-purple-400 text-white font-medium p-2 rounded cursor-pointer
      hover:filter hover:brightness-110 drop-shadow`}
        onClick={onClick}
        type={type}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);

export default Button;
