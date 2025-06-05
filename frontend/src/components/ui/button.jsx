// src/components/ui/button.jsx
import React from "react";

const Button = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600 ${className}`}
    >
      {children}
    </button>
  );
};

export { Button };
