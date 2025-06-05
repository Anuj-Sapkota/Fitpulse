import React, { useState } from "react";

const RegUserLogin = ({ email }) => {
  const [otherField, setOtherField] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("User email:", email);
    console.log("Other field:", otherField);
    
  };

  return (
    <div>
      <h2>Register as Regular User</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Additional info"
          value={otherField}
          onChange={(e) => setOtherField(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RegUserLogin;
