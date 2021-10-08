import React from "react";

function Container({ children, className }) {
  return (
    <div className={`w-11/12 max-w-6xl mx-auto ${className}`}>{children}</div>
  );
}

export default Container;
