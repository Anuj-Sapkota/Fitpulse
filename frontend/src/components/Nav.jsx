import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Images/Nav/Logo1.png";
import Loginprofile from "../assets/Images/Nav/Loginprofile.png";

export default function Nav() {
  return (
    <nav className="w-full  h-[6rem] bg-black text-white flex justify-between items-center py-4 px-8 shadow-md">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img className="w-[9rem] absolute top-0" src={Logo} alt="Logo" />
      </Link>

      {/* Navigation Links */}
      <ul className="flex items-center space-x-12">
        <li>
          <Link
            to="/dashboard"
            className="uppercase font-bold text-white hover:text-red-500 transition duration-200"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/workouts"
            className="uppercase font-bold text-white hover:text-red-500 transition duration-200"
          >
            Workouts
          </Link>
        </li>
        <li>
          <Link
            to="/challanges"
            className="uppercase font-bold text-white hover:text-red-500 transition duration-200"
          >
            Challenges
          </Link>
        </li>
        <li>
          <Link
            to="/progress"
            className="uppercase font-bold text-white hover:text-red-500 transition duration-200"
          >
            Progress
          </Link>
        </li>
        <li>
          <Link
            to="/community"
            className="uppercase font-bold text-white hover:text-red-500 transition duration-200"
          >
            Community
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <img
              className="h-10 w-10 rounded-full border-2 hover:border-red-500 border-white transition duration-200"
              src={Loginprofile}
              alt="Profile"
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
