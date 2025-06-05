import React, { useState } from "react";

const TrainerLogin = ({ email }) => {
  const [trainerInfo, setTrainerInfo] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Trainer email:", email);
    console.log("Trainer info:", trainerInfo);
    // Submit to backend logic
  };

  return (
    <div>
      <h2>Register as Trainer</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Trainer information"
          value={trainerInfo}
          onChange={(e) => setTrainerInfo(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TrainerLogin;
