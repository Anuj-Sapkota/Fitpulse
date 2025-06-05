import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo2 from "../assets/Images/Nav/Logo2.png";
import GoBackIcon from "../assets/Images/Login/GoBack.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Named import

const Login = ({ closeModal, closeLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const pwVisibilityToggle = () => {
    setVisible(!visible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    console.log("Sending:", { email, password });
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        password,
      });
      console.log("Success:", response.data);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      const decodedToken = jwtDecode(response.data.access); // Use named jwtDecode
      const userRole = decodedToken.role;
      closeModal();
      if (userRole === "trainer") {
        navigate("/trainer/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.log("Full Error:", err);
      console.log("Response:", err.response?.status, err.response?.data);
      setError(err.response?.data?.detail || "Login failed - check console");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute w-full h-full bg-black bg-opacity-50"></div>
      <div className="relative z-10 bg-white flex flex-col items-center overflow-hidden rounded-md w-[28rem] h-[25rem]">
        <div className="relative -left-40 z-10 pb-3 pt-4">
          <button onClick={closeModal}>
            <img className="w-6" src={GoBackIcon} alt="Go back" />
          </button>
        </div>
        <div className="flex pb-5 gap-6 w-full px-[3rem] flex-col z-20 relative -top-6 items-center">
          <img className="w-56" src={Logo2} alt="Logo" />
          <h1 className="font-semibold text-center text-[22px] pr-2">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col w-[100%] gap-5">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
              type="email"
              className="border-black border-solid px-3 py-1 rounded-sm border"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                className={`border-solid px-3 py-1 w-[100%] rounded-sm border ${
                  error ? "border-red-600" : "border-black"
                }`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute top-2 right-4 cursor-pointer">
                {visible ? (
                  <FaEyeSlash onClick={pwVisibilityToggle} />
                ) : (
                  <FaEye onClick={pwVisibilityToggle} />
                )}
              </div>
            </div>
            <button
              type="submit"
              className="relative top-3 w-[10rem] bg-[#EC221F] text-white flex items-center justify-center font-medium px-5 py-1.5 rounded-sm hover:bg-[#c43434]"
            >
              Next
            </button>
          </form>
          <div className="flex gap-1">
            <p>First time signing in?</p>
            <button
              onClick={closeLogin}
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

export default Login;