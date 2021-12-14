import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: (props: any) => any;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button = React.forwardRef(
  (
    { className, children, onClick, type, disabled }: ButtonProps,
    ref: React.LegacyRef<HTMLButtonElement>
  ) => {
    return (
      <button
        className={`${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer  hover:brightness-110"
        } text-white font-medium p-2 rounded bg-purple-400
      filter drop-shadow ${className}`}
        onClick={onClick}
        type={type}
        ref={ref}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
);

export default Button;
