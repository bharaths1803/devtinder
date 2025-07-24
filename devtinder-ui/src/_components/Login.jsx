import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const dispactch = useDispatch();
  const navigate = useNavigate();

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/auth/login",
        { emailId, password },
        {
          withCredentials: true,
        }
      );

      dispactch(addUser(res.data));
      return navigate("/");
    } catch (error) {
      setError(error.response.data);
      console.log(error);
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/auth/signup",
        { firstName, lastName, emailId, password },
        {
          withCredentials: true,
        }
      );

      dispactch(addUser(res.data.data));
      return navigate("/profile");
    } catch (error) {
      setError(error.response.data);
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center my-10">
      {" "}
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title flex justify-center">Login</h2>
          <div className="space-y-2">
            {isSignup && (
              <div className="">
                <div className="label mb-1">First name</div>
                <input
                  type="text"
                  placeholder="Bharath"
                  className="input input-md"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            )}
            {isSignup && (
              <div className="">
                <div className="label mb-1">Last name</div>
                <input
                  type="text"
                  placeholder="Bharath"
                  className="input input-md"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            )}
            <div className="">
              <div className="label mb-1">Email Id</div>
              <input
                type="text"
                placeholder="mail@site.com"
                className="input input-md"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </div>
            <div className="">
              <div className="label mb-1">Password</div>
              <input
                type="text"
                className="input input-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <p className="text-red-600">{error}</p>
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary m-2"
              onClick={() => {
                if (isSignup) handleSignup();
                else handleLogin();
              }}
            >
              {isSignup ? "Sign up" : "Login"}
            </button>
          </div>
          <p
            className="m-auto py-2 cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Existing User? Login Here" : "New User? Signup Here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
