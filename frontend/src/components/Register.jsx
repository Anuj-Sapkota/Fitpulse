import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo2 from "../assets/Images/Nav/Logo2.png";
import GoBackIcon from "../assets/Images/Login/GoBack.png";
import axios from "axios";
import Login from "./Login";


const Register = ({ closeModal, openLogin }) => {
  const [visible, setVisible] = useState(false);
  const [selectRole, setSelectRole] = useState(null);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState(false);

  const pwVisibilityToggle = () => {
    setVisible(!visible);
  };

  const handleRoleSelection = (role) => {
    setSelectRole(selectRole === role ? null : role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        username: e.target[0].value,
        email: e.target[1].value,
        password,
        role: selectRole || "user",
      });
      console.log(response.data); // "User registered"
      openLogin(); // Open Login modal instead of closing
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      {/* Background Overlay */}
      <div className="absolute w-full h-full bg-black bg-opacity-50"></div>

      <div className="relative z-10 bg-white flex flex-col items-center overflow-hidden rounded-md w-[28rem] h-[35rem]">
        <div className="relative -left-40 z-10 pb-3 pt-4">
          <button onClick={closeModal}>
            <img className="w-6" src={GoBackIcon} alt="Go back" />
          </button>
        </div>

        <div className="flex pb-5 gap-6 flex-col z-20 relative -top-6 items-center">
          <img className="w-56" src={Logo2} alt="Logo" />
          <h1 className="font-semibold text-center text-[22px] pr-2">CREATE YOUR ACCOUNT</h1>

          <form onSubmit={handleSubmit} className="flex flex-col w-[90%] gap-3">
            <input
              type="text"
              className="border-black border-solid px-3 py-1 rounded-sm border"
              placeholder="Username"
            />
            <input
              type="email"
              className="border-black border-solid px-3 py-1 rounded-sm border"
              placeholder="Email"
            />
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                className={`border-solid px-3 py-1 w-[100%] rounded-sm border ${error ? "border-red-600" : "border-black"}`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute top-2 right-4 cursor-pointer">
                {visible ? <FaEyeSlash onClick={pwVisibilityToggle} /> : <FaEye onClick={pwVisibilityToggle} />}
              </div>
            </div>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                className={`border-solid px-3 py-1 w-[100%] rounded-sm border ${error ? "border-red-600" : "border-black"}`}
                placeholder="Re-type Password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
              {error && <p className="text-red-600 text-sm font-medium px-1">{error}</p>}
              <div className="absolute top-2 right-4 cursor-pointer">
                {visible ? <FaEyeSlash onClick={pwVisibilityToggle} /> : <FaEye onClick={pwVisibilityToggle} />}
              </div>
            </div>
            <div className="flex gap-[1.92rem] items-center relative pt-1">
              <h1 className="text-[14px]">Select Your Role:</h1>
              <button
                type="button"
                onClick={() => handleRoleSelection("user")}
                className={`border-black border-solid border w-32 text-sm rounded-sm font-medium px-1 py-2 hover:bg-black hover:text-white ${selectRole === "user" ? "bg-black text-white" : ""}`}
              >
                Regular User
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelection("trainer")}
                className={`border-black border-solid border text-sm rounded-sm font-medium px-8 py-2 hover:bg-black hover:text-white ${selectRole === "trainer" ? "bg-black text-white" : ""}`}
              >
                Trainer
              </button>
            </div>
            <button
              type="submit"
              className="relative top-3 w-[10rem] bg-[#EC221F] text-white flex items-center justify-center font-medium px-5 py-1.5 rounded-sm hover:bg-[#c43434]"
            >
              Next
            </button>
          </form>
          <div className="flex gap-1">
            <p>Already have an account?</p>
            <button
              onClick={openLogin}
              className="font-semibold text-sm text-red-500 hover:border-b-2 border-red-400"
            >
              Click here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;