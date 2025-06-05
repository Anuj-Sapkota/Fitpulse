// src/components/ui/input.jsx
import React from "react";

const Input = ({ placeholder, value, onChange, className = "" }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border border-gray-300 p-2 rounded-sm w-full ${className}`}
    />
  );
};

export default Input;
