// src/components/ui/card.jsx
import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-white shadow-lg rounded-sm p-4">
      {children}
    </div>
  );
};

const CardContent = ({ children }) => {
  return <div className="mt-2">{children}</div>;
};

export { Card, CardContent };
 