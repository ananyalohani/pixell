import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return <div className={`w-11/12 max-w-6xl mx-auto ${className}`}>{children}</div>;
};

export default Container;
