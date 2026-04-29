import React, { useContext, useState } from 'react'
import Robo1 from "../assets/Robo1.avif"
import Robo2 from "../assets/Robo2.jpeg"
import {IoEye} from "react-icons/io5"
import { IoEyeOff } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext.jsx'
import axios from "axios"

const SignUp = () => {
  const [showPassword,setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();
  const[name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr] = useState("")
  const [loading,setLoading] = useState(false)

  const handleSignUp = async(e)=>{
    e.preventDefault();
    setErr("")
    setLoading(true);
    try{
      let result = await axios.post(`${serverUrl}/api/auth/signup`,
        {name,email,password},{withCredentials:true}
      )
      setUserData(result.data)
      setLoading(false);
      navigate("/customize")
    }catch(error){
      console.log(" Signup error",error)
      setUserData(null)
      setErr(error.response.data.message)
      setLoading(false);
    }
  }

  return (
    <div
      className="w-full h-screen bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${Robo1})` }}
    >
      <form
        className="w-[90%] h-150 max-w-125 bg-[#00000058] backdrop-blur
      shadow-lg shadow-black-950 flex flex-col items-center justify-center gap-5 rounded-2xl px-5"
        onSubmit={handleSignUp}
      >
        <h1 className="text-white text-[30px] font-semibold mb-7.5">
          Register to
          <span className="text-blue-800 ">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter your Name"
          className="w-full h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 
        px-5 py-2.5 rounded-full text-[18px]"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 
        px-5 py-2.5 rounded-full text-[18px]"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div
          className="w-full h-15 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 
        px-5 py-2.5 rounded-full text-[18px] relative"
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full rounded-full outline-none bg-transparent 
          placeholder-gray-300  py-2.5"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          {!showPassword && (
            <IoEye
              className="absolute top-5 right-5 text-white w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
          {showPassword && (
            <IoEyeOff
              className="absolute top-5 right-5 text-white w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>
        {err.length > 0 && (
          <p className="text-red-800 text-[20px] text ">*{err}</p>
        )}
        <button
          type="submit"
          className="min-w-50 h-15 mt-7.5 text-white font-semibold bg-green-600 rounded-full text-[19px] cursor-pointer"
          disabled={loading}
        >
          {loading ? "loading..." : "Sign Up"}
        </button>
        <p
          className="text-white text-[18px] cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account ?{" "}
          <span className="text-blue-400">Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default SignUp