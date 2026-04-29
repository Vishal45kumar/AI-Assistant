import React, { useContext } from 'react'
import Card from '../components/Card'
import j2 from "../assets/j2.jpeg"
import j3 from "../assets/j3.jpeg"
import j4 from "../assets/j4.jpeg"
import j5 from "../assets/j5.jpeg"
import j6 from "../assets/j6.jpeg"
import j7 from "../assets/j7.jpeg"
import j8 from "../assets/j8.jpeg"
import { FaUpload } from "react-icons/fa";
import { useState } from 'react'
import { useRef } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { IoMdArrowRoundBack } from "react-icons/io";

const Customize = () => {
    const {
      serverUrl,
      userData,
      setUserData,
      frontendImage,
      setFrontendImage,
      backendImage,
      setBackendImage,
      selectedImage,
      setSelectedImage,
    } = useContext(userDataContext)
    const inputImage = useRef()
    const Navigate = useNavigate()
    const handleImageChange=(e)=>{
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }
  return (
    <div
      className="w-full min-h-screen bg-linear-to-t from-[black] to-[#030353]
    flex justify-center items-center flex-col p-5"
    >
      <h1 className=" mb-7.5 text-white text-[30px] text-center">
        <span className="text-blue-200">Select your Assistant Image</span>
      </h1>
       <IoMdArrowRoundBack className='absolute top-7.5 left-7.5 text-white w-7 h-7 cursor-pointer' 
            onClick={() =>Navigate("/")}/>
      <div className="w-full max-w-225 flex justify-center items-center flex-wrap gap-4 ">
        <Card image={j2} />
        <Card image={j3} />
        <Card image={j4} />
        <Card image={j5} />
        <Card image={j6} />
        <Card image={j7} />
        <Card image={j8} />
        <div
          className={`w-18 h-39
    lg:w-50 lg:h-70 bg-[#030326] border-2
    border-[#00ff15] overflow-hidden rounded-2xl hover:shadow-2xl hover:shadow-blue-950 cursor-pointer
    hover:border-white hover:border-4 flex items-center justify-center ${selectedImage === "input" ? "border-4 border-white shadow-2xl shadow-blue-950" : null}`}
          onClick={() => {
            inputImage.current.click()
            setSelectedImage("input")
          }}
        >
          {!frontendImage && <FaUpload className="text-white w-7 h-7" />}
          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImageChange}
        />
      </div>
      {selectedImage && (
        <button className="min-w-50 h-15 mt-7.5 text-white font-semibold bg-green-600 rounded-full text-[19px] cursor-pointer"
        onClick={()=>Navigate("/customize2")}>
          Next
        </button>
      )}
    </div>
  );
}

export default Customize